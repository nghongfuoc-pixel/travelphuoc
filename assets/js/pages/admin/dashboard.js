import { q } from '../../db/database.js';
import { formatVND, formatDuration } from '../../format.js';
import { requireAuth, logout } from '../../auth.js';

const session = requireAuth('admin');

const PAGE_SIZE = 20;
let toursPage = 1;
let flightsPage = 1;
let allTours = [];
let allFlights = [];

async function loadStats() {
  const [toursThisMonth] = await q(`SELECT COUNT(*) AS c FROM tours WHERE strftime('%Y-%m', departure_date) = strftime('%Y-%m','now')`);
  const [flightsTotal] = await q('SELECT COUNT(*) AS c FROM flights');
  const [tourBookings] = await q(`SELECT COUNT(*) AS c FROM order_items WHERE item_type = 'tour'`);
  const [flightBookings] = await q(`SELECT COUNT(*) AS c FROM order_items WHERE item_type = 'flight'`);

  document.getElementById('stat-tours-month').textContent = toursThisMonth.c;
  document.getElementById('stat-flights-total').textContent = flightsTotal.c;
  document.getElementById('stat-tour-bookings').textContent = tourBookings.c;
  document.getElementById('stat-flight-bookings').textContent = flightBookings.c;
}

async function loadBarChart() {
  const rows = await q(`
    SELECT a.name AS airline, COUNT(*) AS bookings
    FROM order_items oi
    JOIN flights f ON f.id = oi.item_id AND oi.item_type = 'flight'
    JOIN airlines a ON a.id = f.airline_id
    GROUP BY a.id
    ORDER BY bookings DESC
    LIMIT 10
  `);

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
  const rows = await q(`
    SELECT c.name AS country, COUNT(*) AS bookings
    FROM order_items oi
    JOIN tours t ON t.id = oi.item_id AND oi.item_type = 'tour'
    JOIN countries c ON c.id = t.country_id
    GROUP BY c.id
    ORDER BY bookings DESC
  `);

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
  const rows = await q(`
    SELECT c.name AS country, COUNT(DISTINCT t.id) AS tour_count, COUNT(oi.id) AS booking_count
    FROM order_items oi
    JOIN tours t ON t.id = oi.item_id AND oi.item_type = 'tour'
    JOIN countries c ON c.id = t.country_id
    GROUP BY c.id
    ORDER BY booking_count DESC
    LIMIT 10
  `);

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
  allTours = await q('SELECT * FROM tours ORDER BY departure_date');
  allFlights = await q(`
    SELECT f.*, a.name AS airline_name FROM flights f
    JOIN airlines a ON a.id = f.airline_id
    ORDER BY f.departure_date, f.departure_time
  `);
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
