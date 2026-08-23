import { getDashboardStats, getAirlineBookingStats, getCountryBookingStats, getAdminTours, getAdminFlightsWithAirline } from '../../db/database.js';
import { formatVND, formatDuration } from '../../format.js';
import { requireAuth, logout } from '../../auth.js';

const session = await requireAuth('admin');

const PAGE_SIZE = 20;
let toursPage = 1;
let flightsPage = 1;
let allTours = [];
let allFlights = [];

async function loadStats() {
  const stats = await getDashboardStats();

  document.getElementById('stat-tours-month').textContent = stats.toursThisMonth;
  document.getElementById('stat-flights-total').textContent = stats.flightsTotal;
  document.getElementById('stat-tour-bookings').textContent = stats.tourBookings;
  document.getElementById('stat-flight-bookings').textContent = stats.flightBookings;
}

async function loadBarChart() {
  const rows = await getAirlineBookingStats();

  new Chart(document.getElementById('airline-bar-chart'), {
    type: 'bar',
    data: {
      labels: rows.map(r => r.airline),
      datasets: [{
        label: 'Số lượt đặt',
        data: rows.map(r => r.bookings),
        backgroundColor: '#0F79E0',
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true, ticks: { precision: 0 } } }
    }
  });
}

async function loadPieChart() {
  const rows = (await getCountryBookingStats()).map(r => ({ country: r.country, bookings: r.booking_count }));

  const palette = ['#0F79E0', '#00B894', '#FF7A00', '#E11D48', '#8B5CF6', '#F59E0B', '#14B8A6', '#EC4899', '#64748B', '#22C55E'];

  new Chart(document.getElementById('country-pie-chart'), {
    type: 'pie',
    data: {
      labels: rows.map(r => r.country),
      datasets: [{
        data: rows.map(r => r.bookings),
        backgroundColor: palette
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } } }
    }
  });
}

async function loadCountryTable() {
  const rows = (await getCountryBookingStats()).slice(0, 10);

  document.getElementById('country-table-body').innerHTML = rows.map(r => `
    <tr>
      <td>${r.country}</td>
      <td>${r.tour_count}</td>
      <td>${r.booking_count}</td>
    </tr>
  `).join('');
}

function renderPagination(containerId, total, page, onChange) {
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const container = document.getElementById(containerId);
  let html = `<button ${page === 1 ? 'disabled' : ''} data-page="${page - 1}">‹</button>`;
  for (let p = 1; p <= totalPages; p++) {
    html += `<button class="${p === page ? 'active' : ''}" data-page="${p}">${p}</button>`;
  }
  html += `<button ${page === totalPages ? 'disabled' : ''} data-page="${page + 1}">›</button>`;
  container.innerHTML = html;
  container.querySelectorAll('button[data-page]').forEach(btn => {
    btn.addEventListener('click', () => onChange(Number(btn.dataset.page)));
  });
}

function renderToursTable() {
  const start = (toursPage - 1) * PAGE_SIZE;
  const rows = allTours.slice(start, start + PAGE_SIZE);
  document.getElementById('tours-table-body').innerHTML = rows.map(t => `
    <tr>
      <td>${t.id}</td>
      <td>${t.name}</td>
      <td>${t.operator}</td>
      <td>${t.days}N${t.nights}Đ</td>
      <td>${t.departure_date}</td>
      <td>${formatVND(t.price)}</td>
    </tr>
  `).join('');
  renderPagination('tours-pagination', allTours.length, toursPage, (p) => { toursPage = p; renderToursTable(); });
}

function renderFlightsTable() {
  const start = (flightsPage - 1) * PAGE_SIZE;
  const rows = allFlights.slice(start, start + PAGE_SIZE);
  document.getElementById('flights-table-body').innerHTML = rows.map(f => `
    <tr>
      <td>${f.id}</td>
      <td>${f.airline_name}</td>
      <td>${f.origin} → ${f.destination}</td>
      <td>${f.departure_date} ${f.departure_time}</td>
      <td>${formatDuration(f.duration_minutes)}</td>
      <td>${formatVND(f.price_economy)}</td>
    </tr>
  `).join('');
  renderPagination('flights-pagination', allFlights.length, flightsPage, (p) => { flightsPage = p; renderFlightsTable(); });
}

async function loadLists() {
  allTours = await getAdminTours();
  allFlights = await getAdminFlightsWithAirline();
  renderToursTable();
  renderFlightsTable();
}

document.getElementById('admin-username').textContent = session.username;
document.getElementById('admin-logout').addEventListener('click', (e) => { e.preventDefault(); logout(); });

loadStats();
loadBarChart();
loadPieChart();
loadCountryTable();
loadLists();
