import { getAirlines, getFlightById, insertFlight, updateFlight } from '../../db/database.js';
import { requireAuth, logout } from '../../auth.js';
import { readFileAsDataURL } from '../../upload.js';

const session = await requireAuth('admin');
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
  const airlines = await getAirlines();
  document.getElementById('f-airline').innerHTML = airlines.map(a => `<option value="${a.id}">${a.name}</option>`).join('');
}

async function loadExisting() {
  if (!editId) return;
  document.getElementById('form-title').textContent = 'Sửa chuyến bay';
  const f = await getFlightById(editId);
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

  const existingThumbnail = editId ? (await getFlightById(editId))?.thumbnail_url : null;
  const thumbnailUrl = uploadedThumbnail || existingThumbnail || null;

  const data = {
    airline_id: Number(document.getElementById('f-airline').value),
    origin: document.getElementById('f-origin').value.trim(),
    destination: document.getElementById('f-destination').value.trim(),
    departure_date: document.getElementById('f-departure-date').value,
    departure_time: document.getElementById('f-departure-time').value,
    arrival_time: document.getElementById('f-arrival-time').value,
    duration_minutes: Number(document.getElementById('f-duration').value),
    trip_type: document.getElementById('f-trip-type').value,
    stop_type: document.getElementById('f-stop-type').value,
    aircraft_type: document.getElementById('f-aircraft').value.trim(),
    price_economy: Number(document.getElementById('f-price-economy').value),
    price_business: Number(document.getElementById('f-price-business').value),
    services: document.getElementById('f-services').value.trim(),
    thumbnail_url: thumbnailUrl
  };

  if (editId) {
    await updateFlight(editId, data);
  } else {
    await insertFlight(data);
  }

  window.location.href = 'flights.html';
});

document.getElementById('admin-username').textContent = session.username;
document.getElementById('admin-logout').addEventListener('click', (e) => { e.preventDefault(); logout(); });

loadAirlines().then(loadExisting);
