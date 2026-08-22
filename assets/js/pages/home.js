import { q } from '../db/database.js';
import { formatVND } from '../format.js';
import { updateCartBadge } from '../cart.js';
import { renderAuthHeader } from '../auth.js';

async function renderFeaturedTours() {
  const tours = await q('SELECT * FROM tours WHERE featured = 1 ORDER BY id LIMIT 8');
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
  const origins = await q('SELECT DISTINCT origin FROM flights ORDER BY origin');
  const destinations = await q('SELECT DISTINCT destination FROM flights ORDER BY destination');

  document.getElementById('from-input').innerHTML =
    '<option value="" disabled selected>Chọn điểm đi</option>' +
    origins.map(r => `<option value="${r.origin}">${r.origin}</option>`).join('');

  document.getElementById('to-input').innerHTML =
    '<option value="" disabled selected>Chọn điểm đến</option>' +
    destinations.map(r => `<option value="${r.destination}">${r.destination}</option>`).join('');
}

async function renderAirlines() {
  const airlines = await q('SELECT * FROM airlines ORDER BY id');
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

renderFeaturedTours();
renderRouteOptions();
renderAirlines();
wireSearchForm();
updateCartBadge();
renderAuthHeader();
