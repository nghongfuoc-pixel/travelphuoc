const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
const REQUEST_TIMEOUT_MS = 6000;

// Mã thời tiết WMO (Open-Meteo) -> mô tả ngắn tiếng Việt
const WEATHER_CODE_DESCRIPTIONS = {
  0: 'Trời quang',
  1: 'Ít mây',
  2: 'Có mây',
  3: 'Nhiều mây',
  45: 'Sương mù',
  48: 'Sương mù đóng băng',
  51: 'Mưa phùn nhẹ',
  53: 'Mưa phùn',
  55: 'Mưa phùn dày',
  56: 'Mưa phùn đóng băng nhẹ',
  57: 'Mưa phùn đóng băng dày',
  61: 'Mưa nhẹ',
  63: 'Mưa vừa',
  65: 'Mưa to',
  66: 'Mưa đóng băng nhẹ',
  67: 'Mưa đóng băng to',
  71: 'Tuyết rơi nhẹ',
  73: 'Tuyết rơi vừa',
  75: 'Tuyết rơi dày',
  77: 'Hạt tuyết',
  80: 'Mưa rào nhẹ',
  81: 'Mưa rào vừa',
  82: 'Mưa rào dữ dội',
  85: 'Mưa tuyết nhẹ',
  86: 'Mưa tuyết dày',
  95: 'Dông',
  96: 'Dông kèm mưa đá nhẹ',
  99: 'Dông kèm mưa đá to',
};

export class CityNotFoundError extends Error {
  constructor(cityName) {
    super(`Không tìm thấy thành phố "${cityName}"`);
    this.name = 'CityNotFoundError';
  }
}

export class WeatherApiError extends Error {
  constructor(reason) {
    super(reason === 'timeout' ? 'Máy chủ thời tiết phản hồi quá chậm' : 'Không thể lấy dữ liệu thời tiết');
    this.name = 'WeatherApiError';
    this.reason = reason;
  }
}

function describeWeatherCode(code) {
  return WEATHER_CODE_DESCRIPTIONS[code] || 'Không rõ';
}

async function fetchJsonWithTimeout(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new WeatherApiError('network');
    return await res.json();
  } catch (err) {
    if (err.name === 'AbortError') throw new WeatherApiError('timeout');
    if (err instanceof WeatherApiError) throw err;
    throw new WeatherApiError('network');
  } finally {
    clearTimeout(timer);
  }
}

async function geocodeCity(cityName) {
  const url = `${GEOCODING_URL}?name=${encodeURIComponent(cityName)}&count=1&language=vi&format=json`;
  const data = await fetchJsonWithTimeout(url);
  const match = data.results && data.results[0];
  if (!match) throw new CityNotFoundError(cityName);
  return { latitude: match.latitude, longitude: match.longitude, name: match.name };
}

async function getCurrentWeather(latitude, longitude) {
  const url = `${FORECAST_URL}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&timezone=auto`;
  const data = await fetchJsonWithTimeout(url);
  const current = data.current;
  if (!current) throw new WeatherApiError('network');
  return { temperature: current.temperature_2m, code: current.weather_code };
}

export async function getWeatherByCity(cityName) {
  const location = await geocodeCity(cityName);
  const weather = await getCurrentWeather(location.latitude, location.longitude);
  return {
    city: location.name,
    temperature: weather.temperature,
    description: describeWeatherCode(weather.code),
  };
}
