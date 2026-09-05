const FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast';
const REQUEST_TIMEOUT_MS = 6000;

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

async function fetchWithTimeout(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

// Rút gọn 40 mốc 3-giờ (5 ngày) của OpenWeatherMap thành 1 mốc/ngày, ưu tiên mốc gần 12:00 trưa.
function pickDailyEntries(list) {
  const byDate = new Map();
  for (const item of list) {
    const date = item.dt_txt.slice(0, 10);
    const hour = Number(item.dt_txt.slice(11, 13));
    const existing = byDate.get(date);
    if (!existing || Math.abs(hour - 12) < Math.abs(existing.hour - 12)) {
      byDate.set(date, { hour, item });
    }
  }
  return Array.from(byDate.values())
    .slice(0, 5)
    .map(({ item }) => ({
      date: item.dt_txt.slice(0, 10),
      temp: Math.round(item.main.temp),
      description: item.weather[0]?.description || '',
      icon: item.weather[0]?.icon || '01d',
    }));
}

export async function onRequestGet(context) {
  const { request, env } = context;
  const city = new URL(request.url).searchParams.get('city')?.trim();

  if (!city) {
    return jsonResponse({ error: 'Thiếu tham số city' }, 400);
  }

  const apiKey = env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    return jsonResponse({ error: 'Server chưa cấu hình API key' }, 500);
  }

  const url = `${FORECAST_URL}?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&lang=vi`;

  let res;
  try {
    res = await fetchWithTimeout(url);
  } catch (err) {
    if (err.name === 'AbortError') {
      return jsonResponse({ error: 'Máy chủ thời tiết phản hồi quá chậm' }, 504);
    }
    return jsonResponse({ error: 'Không thể kết nối tới máy chủ thời tiết' }, 502);
  }

  if (res.status === 404) {
    return jsonResponse({ error: `Không tìm thấy thành phố "${city}"` }, 404);
  }
  if (!res.ok) {
    return jsonResponse({ error: 'Không thể lấy dữ liệu thời tiết' }, 502);
  }

  const data = await res.json();
  const days = pickDailyEntries(data.list || []);
  return jsonResponse({ city: data.city?.name || city, days });
}
