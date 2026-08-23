import { getFlightById } from '../db/database.js';
import { formatVND, formatDuration } from '../format.js';
import { addToCart, updateCartBadge } from '../cart.js';
import { renderAuthHeader } from '../auth.js';

const params = new URLSearchParams(window.location.search);
const id = Number(params.get('id'));

async function load() {
  const flight = await getFlightById(id);

  if (!flight) {
    document.getElementById('flight-overview').innerHTML = '<p class="empty-state">Không tìm thấy chuyến bay.</p>';
    return;
  }

  document.getElementById('flight-overview').innerHTML = `
    <img src="${flight.airline_logo}" alt="${flight.airline_name}">
    <div>
      <h1>${flight.origin} → ${flight.destination}</h1>
      <p>${flight.departure_date} · ${flight.departure_time} - ${flight.arrival_time} (${formatDuration(flight.duration_minutes)})</p>
      <p>${flight.airline_name} · ${flight.aircraft_type} · ${flight.stop_type === 'direct' ? 'Bay thẳng' : 'Nhiều thành phố'} · ${flight.trip_type === 'roundtrip' ? 'Khứ hồi' : 'Một chiều'}</p>
    </div>
  `;

  document.getElementById('price-economy').textContent = formatVND(flight.price_economy);
  document.getElementById('price-business').textContent = formatVND(flight.price_business);

  document.getElementById('select-economy').addEventListener('click', () => select(flight, 'economy', flight.price_economy));
  document.getElementById('select-business').addEventListener('click', () => select(flight, 'business', flight.price_business));
}

async function select(flight, fareClass, price) {
  await addToCart({ itemType: 'flight', itemId: flight.id, fareClass, price });
  await updateCartBadge();
  showToast();
}

function showToast() {
  const toast = document.getElementById('toast');
  toast.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove('show'), 4000);
}

load();
updateCartBadge();
renderAuthHeader();
