import { getAirlines, getFlightsWithAirline } from '../db/database.js';
import { formatVND, formatDuration, timeBucket, TIME_BUCKET_LABELS } from '../format.js';
import { updateCartBadge } from '../cart.js';
import { renderAuthHeader } from '../auth.js';

const params = new URLSearchParams(window.location.search);
let allFlights = [];
let airlines = [];

const state = {
  sort: 'asc',
  tripTypes: new Set(),
  stopTypes: new Set(),
  airlineIds: new Set(params.get('airline') ? [Number(params.get('airline'))] : []),
  timeBuckets: new Set(),
  fareClasses: new Set()
};

async function load() {
  airlines = await getAirlines();
  allFlights = await getFlightsWithAirline();
  renderSidebar();
  renderSummary();
  applyFiltersAndRender();
}

function renderSidebar() {
  const airlineWrap = document.getElementById('filter-airlines');
  airlineWrap.innerHTML = airlines.map(a => `
    <label class="filter-check">
      <input type="checkbox" value="${a.id}" data-filter="airline" ${state.airlineIds.has(a.id) ? 'checked' : ''}>
      ${a.name}
    </label>
  `).join('');

  const timeWrap = document.getElementById('filter-time');
  timeWrap.innerHTML = Object.entries(TIME_BUCKET_LABELS).map(([key, label]) => `
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
    state.tripTypes.clear();
    state.stopTypes.clear();
    state.airlineIds.clear();
    state.timeBuckets.clear();
    state.fareClasses.clear();
    document.querySelectorAll('[data-filter]').forEach(el => { el.checked = false; });
    applyFiltersAndRender();
  });
}

function onFilterChange(e) {
  const type = e.target.dataset.filter;
  const setMap = {
    trip: state.tripTypes,
    stop: state.stopTypes,
    airline: state.airlineIds,
    time: state.timeBuckets,
    fare: state.fareClasses
  };
  const set = setMap[type];
  const value = type === 'airline' ? Number(e.target.value) : e.target.value;
  if (e.target.checked) set.add(value); else set.delete(value);
  applyFiltersAndRender();
}

function renderSummary() {
  const from = params.get('from') || 'Bất kỳ';
  const to = params.get('to') || 'Bất kỳ';
  const date = params.get('date') || '';
  document.getElementById('search-summary').textContent = `${from} → ${to}${date ? ' · ' + date : ''}`;
}

function applyFiltersAndRender() {
  let list = allFlights.filter(f => {
    if (state.tripTypes.size && !state.tripTypes.has(f.trip_type)) return false;
    if (state.stopTypes.size && !state.stopTypes.has(f.stop_type)) return false;
    if (state.airlineIds.size && !state.airlineIds.has(f.airline_id)) return false;
    if (state.timeBuckets.size && !state.timeBuckets.has(timeBucket(f.departure_time))) return false;
    return true;
  });
  list.sort((a, b) => state.sort === 'asc'
    ? a.price_economy - b.price_economy
    : b.price_economy - a.price_economy
  );
  renderList(list);
}

function renderList(list) {
  const container = document.getElementById('flight-list');
  document.getElementById('result-count').textContent = `${list.length} chuyến bay`;

  if (!list.length) {
    container.innerHTML = '<p class="empty-state">Không tìm thấy chuyến bay phù hợp.</p>';
    return;
  }

  container.innerHTML = list.map(f => `
    <a class="flight-row" href="flight-detail.html?id=${f.id}">
      <img class="flight-row-logo" src="${f.airline_logo}" alt="${f.airline_name}">
      <div class="flight-row-info">
        <div class="flight-row-airline">${f.airline_name}</div>
        <div class="flight-row-route">${f.origin} ${f.departure_time} → ${f.destination} ${f.arrival_time}</div>
        <div class="flight-row-meta">
          ${f.departure_date} · ${formatDuration(f.duration_minutes)} ·
          ${f.stop_type === 'direct' ? 'Bay thẳng' : 'Nhiều thành phố'} ·
          ${f.trip_type === 'roundtrip' ? 'Khứ hồi' : 'Một chiều'}
        </div>
      </div>
      <div class="flight-row-price">
        <span class="price">${formatVND(f.price_economy)}</span>
        <span class="btn btn-outline">Chọn</span>
      </div>
    </a>
  `).join('');
}

load();
updateCartBadge();
renderAuthHeader();
