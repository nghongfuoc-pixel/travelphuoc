import { q, exec } from '../../db/database.js';
import { requireAuth, logout } from '../../auth.js';
import { readFileAsDataURL } from '../../upload.js';

const session = requireAuth('admin');
const params = new URLSearchParams(window.location.search);
const editId = params.get('id') ? Number(params.get('id')) : null;
let uploadedThumbnail = null;

function showPreview(src) {
  const img = document.getElementById('thumbnail-preview');
  img.src = src || '';
  img.style.display = src ? 'block' : 'none';
}

document.getElementById('f-thumbnail').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  uploadedThumbnail = await readFileAsDataURL(file);
  showPreview(uploadedThumbnail);
});

async function loadAirlines() {
  const airlines = await q('SELECT * FROM airlines ORDER BY name');
  document.getElementById('f-airline').innerHTML = airlines.map(a => `<option value="${a.id}">${a.name}</option>`).join('');
}

async function loadExisting() {
  if (!editId) return;
  document.getElementById('form-title').textContent = 'Sửa chuyến bay';
  const [f] = await q('SELECT * FROM flights WHERE id = ?', [editId]);
  if (!f) return;

  document.getElementById('f-airline').value = f.airline_id;
  document.getElementById('f-origin').value = f.origin;
  document.getElementById('f-destination').value = f.destination;
  document.getElementById('f-departure-date').value = f.departure_date;
  document.getElementById('f-departure-time').value = f.departure_time;
  document.getElementById('f-arrival-time').value = f.arrival_time;
  document.getElementById('f-duration').value = f.duration_minutes;
  document.getElementById('f-trip-type').value = f.trip_type;
  document.getElementById('f-stop-type').value = f.stop_type;
  document.getElementById('f-aircraft').value = f.aircraft_type;
  document.getElementById('f-price-economy').value = f.price_economy;
  document.getElementById('f-price-business').value = f.price_business;
  document.getElementById('f-services').value = f.services || '';
  showPreview(f.thumbnail_url);
}

document.getElementById('flight-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const existingThumbnail = editId ? (await q('SELECT thumbnail_url FROM flights WHERE id = ?', [editId]))[0]?.thumbnail_url : null;
  const thumbnailUrl = uploadedThumbnail || existingThumbnail || null;

  const data = [
    Number(document.getElementById('f-airline').value),
    document.getElementById('f-origin').value.trim(),
    document.getElementById('f-destination').value.trim(),
    document.getElementById('f-departure-date').value,
    document.getElementById('f-departure-time').value,
    document.getElementById('f-arrival-time').value,
    Number(document.getElementById('f-duration').value),
    document.getElementById('f-trip-type').value,
    document.getElementById('f-stop-type').value,
    document.getElementById('f-aircraft').value.trim(),
    Number(document.getElementById('f-price-economy').value),
    Number(document.getElementById('f-price-business').value),
    document.getElementById('f-services').value.trim(),
    thumbnailUrl
  ];

  if (editId) {
    await exec(
      `UPDATE flights SET airline_id=?, origin=?, destination=?, departure_date=?, departure_time=?, arrival_time=?, duration_minutes=?, trip_type=?, stop_type=?, aircraft_type=?, price_economy=?, price_business=?, services=?, thumbnail_url=? WHERE id=?`,
      [...data, editId]
    );
  } else {
    await exec(
      `INSERT INTO flights (airline_id, origin, destination, departure_date, departure_time, arrival_time, duration_minutes, trip_type, stop_type, aircraft_type, price_economy, price_business, services, thumbnail_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      data
    );
  }

  window.location.href = 'flights.html';
});

document.getElementById('admin-username').textContent = session.username;
document.getElementById('admin-logout').addEventListener('click', (e) => { e.preventDefault(); logout(); });

loadAirlines().then(loadExisting);
