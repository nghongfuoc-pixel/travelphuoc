import { q, exec, genItinerary } from '../../db/database.js';
import { requireAuth, logout } from '../../auth.js';
import { readFileAsDataURL } from '../../upload.js';

const session = requireAuth('admin');
const params = new URLSearchParams(window.location.search);
const editId = params.get('id') ? Number(params.get('id')) : null;
let uploadedThumbnail = null;

function showPreview(src) {
  const img = document.getElementById('thumbnail-preview');
  img.src = src;
  img.style.display = src ? 'block' : 'none';
}

document.getElementById('f-thumbnail').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  uploadedThumbnail = await readFileAsDataURL(file);
  showPreview(uploadedThumbnail);
});

async function loadOptions() {
  const airlines = await q('SELECT * FROM airlines ORDER BY name');
  const countries = await q('SELECT * FROM countries ORDER BY name');
  document.getElementById('f-airline').innerHTML = airlines.map(a => `<option value="${a.id}">${a.name}</option>`).join('');
  document.getElementById('f-country').innerHTML = countries.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
}

async function loadExisting() {
  if (!editId) return;
  document.getElementById('form-title').textContent = 'Sửa tour';
  const [t] = await q('SELECT * FROM tours WHERE id = ?', [editId]);
  if (!t) return;

  document.getElementById('f-name').value = t.name;
  document.getElementById('f-operator').value = t.operator;
  document.getElementById('f-days').value = t.days;
  document.getElementById('f-nights').value = t.nights;
  document.getElementById('f-price').value = t.price;
  document.getElementById('f-origin').value = t.origin;
  document.getElementById('f-destination').value = t.destination;
  document.getElementById('f-departure-date').value = t.departure_date;
  document.getElementById('f-departure-time').value = t.departure_time;
  document.getElementById('f-duration').value = t.duration_minutes;
  document.getElementById('f-airline').value = t.airline_id;
  document.getElementById('f-aircraft').value = t.aircraft_type;
  document.getElementById('f-country').value = t.country_id;
  document.getElementById('f-services').value = t.services || '';
  document.getElementById('f-featured').checked = !!t.featured;
  showPreview(t.thumbnail_url);
}

document.getElementById('tour-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = {
    name: document.getElementById('f-name').value.trim(),
    operator: document.getElementById('f-operator').value.trim(),
    days: Number(document.getElementById('f-days').value),
    nights: Number(document.getElementById('f-nights').value),
    price: Number(document.getElementById('f-price').value),
    origin: document.getElementById('f-origin').value.trim(),
    destination: document.getElementById('f-destination').value.trim(),
    departureDate: document.getElementById('f-departure-date').value,
    departureTime: document.getElementById('f-departure-time').value,
    duration: Number(document.getElementById('f-duration').value),
    airlineId: Number(document.getElementById('f-airline').value),
    aircraft: document.getElementById('f-aircraft').value.trim(),
    countryId: Number(document.getElementById('f-country').value),
    services: document.getElementById('f-services').value.trim(),
    featured: document.getElementById('f-featured').checked ? 1 : 0
  };

  const existingThumbnail = editId ? (await q('SELECT thumbnail_url FROM tours WHERE id = ?', [editId]))[0]?.thumbnail_url : null;
  const thumbnailUrl = uploadedThumbnail || existingThumbnail || `https://placehold.co/600x400/0F79E0/FFFFFF?text=${encodeURIComponent(data.destination)}`;
  let tourId = editId;

  if (editId) {
    await exec(
      `UPDATE tours SET name=?, operator=?, thumbnail_url=?, days=?, nights=?, price=?, origin=?, destination=?, departure_date=?, departure_time=?, duration_minutes=?, airline_id=?, aircraft_type=?, country_id=?, services=?, featured=? WHERE id=?`,
      [data.name, data.operator, thumbnailUrl, data.days, data.nights, data.price, data.origin, data.destination,
        data.departureDate, data.departureTime, data.duration, data.airlineId, data.aircraft, data.countryId,
        data.services, data.featured, editId]
    );
    await exec('DELETE FROM tour_itinerary WHERE tour_id = ?', [editId]);
  } else {
    await exec(
      `INSERT INTO tours (name, operator, thumbnail_url, days, nights, price, origin, destination, departure_date, departure_time, duration_minutes, airline_id, aircraft_type, country_id, services, featured)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [data.name, data.operator, thumbnailUrl, data.days, data.nights, data.price, data.origin, data.destination,
        data.departureDate, data.departureTime, data.duration, data.airlineId, data.aircraft, data.countryId,
        data.services, data.featured]
    );
    const [{ id }] = await q('SELECT id FROM tours ORDER BY id DESC LIMIT 1');
    tourId = id;
  }

  for (const it of genItinerary(data.destination, data.days)) {
    await exec(
      'INSERT INTO tour_itinerary (tour_id, day_number, title, description) VALUES (?, ?, ?, ?)',
      [tourId, it.day, it.title, it.description]
    );
  }

  window.location.href = 'tours.html';
});

document.getElementById('admin-username').textContent = session.username;
document.getElementById('admin-logout').addEventListener('click', (e) => { e.preventDefault(); logout(); });

loadOptions().then(loadExisting);
