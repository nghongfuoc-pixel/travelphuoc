export class ForecastApiError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ForecastApiError';
  }
}

export async function getFiveDayForecast(city) {
  const res = await fetch(`/api/weather-forecast?city=${encodeURIComponent(city)}`);
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new ForecastApiError(data?.error || 'Không thể lấy dữ liệu dự báo thời tiết');
  }
  return data;
}
