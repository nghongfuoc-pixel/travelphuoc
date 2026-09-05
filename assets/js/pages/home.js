import { getFeaturedTours, getAirlines, getFlightRoutePoints } from '../db/database.js';
import { formatVND } from '../format.js';
import { updateCartBadge } from '../cart.js';
import { renderAuthHeader } from '../auth.js';
import { getWeatherByCity, CityNotFoundError, WeatherApiError } from '../weather.js';
import { getFiveDayForecast, ForecastApiError } from '../weather-forecast.js';

async function renderFeaturedTours() {
  const tours = await getFeaturedTours();
  const grid = document.getElementById('featured-tours');
  grid.innerHTML = tours.map(t => `
    <a class="tour-card" href="tour-detail.html?id=${t.id}">
      <img src="${t.thumbnail_url}" alt="${t.name}" width="600" height="400">
      <div class="tour-card-body">
        <h3>${t.name}</h3>
        <p class="tour-card-operator">${t.operator}</p>
        <div class="tour-card-meta">
          <span class="badge">${t.days}N${t.nights}Đ</span>
          <span class="price">${formatVND(t.price)}</span>
        </div>
      </div>
    </a>
  `).join('');
}

async function renderRouteOptions() {
  const { origins, destinations } = await getFlightRoutePoints();

  document.getElementById('from-input').innerHTML =
    '<option value="" disabled selected>Chọn điểm đi</option>' +
    origins.map(o => `<option value="${o}">${o}</option>`).join('');

  document.getElementById('to-input').innerHTML =
    '<option value="" disabled selected>Chọn điểm đến</option>' +
    destinations.map(d => `<option value="${d}">${d}</option>`).join('');
}

async function renderAirlines() {
  const airlines = await getAirlines();
  const wrap = document.getElementById('airline-list');
  wrap.innerHTML = airlines.map(a => `
    <a class="airline-logo" href="flights.html?airline=${a.id}">
      <img src="${a.logo_url}" alt="${a.name}">
    </a>
  `).join('');
}

function wireSearchForm() {
  const form = document.getElementById('search-form');
  const tripTabs = document.querySelectorAll('.trip-tab');
  const returnField = document.getElementById('return-date-field');
  let tripType = 'roundtrip';

  tripTabs.forEach(tab => tab.addEventListener('click', () => {
    tripTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    tripType = tab.dataset.trip;
    returnField.style.display = tripType === 'roundtrip' ? '' : 'none';
  }));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const params = new URLSearchParams({
      from: document.getElementById('from-input').value,
      to: document.getElementById('to-input').value,
      date: document.getElementById('depart-date').value,
      tripType
    });
    const returnDate = document.getElementById('return-date').value;
    if (tripType === 'roundtrip' && returnDate) {
      params.set('returnDate', returnDate);
    }
    window.location.href = 'flights.html?' + params.toString();
  });
}

function formatForecastDate(dateStr) {
  const [, month, day] = dateStr.split('-');
  return `${day}/${month}`;
}

function renderForecastDays(days) {
  const container = document.getElementById('weather-forecast');
  container.innerHTML = days.map(d => `
    <div class="forecast-day">
      <span class="forecast-date">${formatForecastDate(d.date)}</span>
      <img class="forecast-icon" src="https://openweathermap.org/img/wn/${d.icon}@2x.png" alt="${d.description}">
      <span class="forecast-temp">${d.temp}°C</span>
    </div>
  `).join('');
}

function wireWeatherWidget() {
  const form = document.getElementById('weather-form');
  const input = document.getElementById('weather-city-input');
  const result = document.getElementById('weather-result');
  const forecast = document.getElementById('weather-forecast');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const city = input.value.trim();
    if (!city) return;

    result.className = 'weather-result is-loading';
    result.textContent = 'Đang tải dữ liệu thời tiết...';
    forecast.innerHTML = '';

    try {
      const weather = await getWeatherByCity(city);
      result.className = 'weather-result';
      result.textContent = `${weather.city}: ${weather.temperature}°C, ${weather.description}`;
    } catch (err) {
      result.className = 'weather-result is-error';
      if (err instanceof CityNotFoundError) {
        result.textContent = err.message;
      } else if (err instanceof WeatherApiError) {
        result.textContent = err.message + ', vui lòng thử lại.';
      } else {
        result.textContent = 'Đã có lỗi xảy ra, vui lòng thử lại.';
      }
      return;
    }

    try {
      const data = await getFiveDayForecast(city);
      renderForecastDays(data.days);
    } catch (err) {
      const message = err instanceof ForecastApiError ? err.message : 'Không thể lấy dự báo 5 ngày.';
      forecast.innerHTML = `<p class="weather-result is-error">${message}</p>`;
    }
  });
}

renderFeaturedTours();
renderRouteOptions();
renderAirlines();
wireSearchForm();
wireWeatherWidget();
updateCartBadge();
renderAuthHeader();
