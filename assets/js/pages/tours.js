import { getAirlines, getToursWithAirline } from '../db/database.js';
import { formatVND, formatDuration, timeBucket, TIME_BUCKET_LABELS } from '../format.js';
import { updateCartBadge } from '../cart.js';
import { renderAuthHeader } from '../auth.js';

let allTours = [];
let airlines = [];

const state = {
  sort: 'asc',
  airlineIds: new Set(),
  timeBuckets: new Set()
};

async function load() {
  airlines = await getAirlines();
  allTours = await getToursWithAirline();
  renderSidebar();
  applyFiltersAndRender();
}

function renderSidebar() {
  document.getElementById('filter-airlines').innerHTML = airlines.map(a => `
    <label class="filter-check">
      <input type="checkbox" value="${a.id}" data-filter="airline">
      ${a.name}
    </label>
  `).join('');

  document.getElementById('filter-time').innerHTML = Object.entries(TIME_BUCKET_LABELS).map(([key, label]) => `
    <label class="filter-check">
      <input type="checkbox" value="${key}" data-filter="time">
      ${label}
    </label>
  `).join('');

  document.querySelectorAll('[data-filter]').forEach(el => el.addEventListener('change', onFilterChange));
  document.getElementById('sort-select').addEventListener('change', (e) => {
    state.sort = e.target.value;
    applyFiltersAndRender();
  });
  document.getElementById('clear-filters').addEventListener('click', () => {
    state.airlineIds.clear();
    state.timeBuckets.clear();
    document.querySelectorAll('[data-filter]').forEach(el => { el.checked = false; });
    applyFiltersAndRender();
  });
}

function onFilterChange(e) {
  const type = e.target.dataset.filter;
  const set = type === 'airline' ? state.airlineIds : state.timeBuckets;
  const value = type === 'airline' ? Number(e.target.value) : e.target.value;
  if (e.target.checked) set.add(value); else set.delete(value);
  applyFiltersAndRender();
}

function applyFiltersAndRender() {
  let list = allTours.filter(t => {
    if (state.airlineIds.size && !state.airlineIds.has(t.airline_id)) return false;
    if (state.timeBuckets.size && !state.timeBuckets.has(timeBucket(t.departure_time))) return false;
    return true;
  });
  list.sort((a, b) => state.sort === 'asc' ? a.price - b.price : b.price - a.price);
  renderList(list);
}

function renderList(list) {
  const container = document.getElementById('tour-list');
  document.getElementById('result-count').textContent = `${list.length} tour`;

  if (!list.length) {
    container.innerHTML = '<p class="empty-state">Không tìm thấy tour phù hợp.</p>';
    return;
  }

  container.innerHTML = list.map(t => `
    <a class="flight-row" href="tour-detail.html?id=${t.id}">
      <img class="flight-row-logo" src="${t.airline_logo}" alt="${t.airline_name}">
      <div class="flight-row-info">
        <div class="flight-row-airline">${t.name}</div>
        <div class="flight-row-route">${t.origin} → ${t.destination} · ${t.days}N${t.nights}Đ</div>
        <div class="flight-row-meta">${t.departure_date} ${t.departure_time} · ${formatDuration(t.duration_minutes)} · ${t.airline_name}</div>
      </div>
      <div class="flight-row-price">
        <span class="price">${formatVND(t.price)}</span>
        <span class="btn btn-outline">Xem tour</span>
      </div>
    </a>
  `).join('');
}

load();
updateCartBadge();
renderAuthHeader();
