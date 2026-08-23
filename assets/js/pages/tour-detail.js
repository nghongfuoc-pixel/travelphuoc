import { getTourById, getTourItinerary } from '../db/database.js';
import { formatVND, formatDuration } from '../format.js';
import { addToCart, updateCartBadge } from '../cart.js';
import { renderAuthHeader } from '../auth.js';

const params = new URLSearchParams(window.location.search);
const id = Number(params.get('id'));

async function load() {
  const tour = await getTourById(id);

  if (!tour) {
    document.getElementById('tour-overview').innerHTML = '<p class="empty-state">Không tìm thấy tour.</p>';
    return;
  }

  document.getElementById('tour-image').src = tour.thumbnail_url;
  document.getElementById('tour-image').alt = tour.name;

  document.getElementById('tour-overview').innerHTML = `
    <img src="${tour.airline_logo}" alt="${tour.airline_name}">
    <div>
      <h1>${tour.name}</h1>
      <p>${tour.origin} → ${tour.destination} · ${tour.days}N${tour.nights}Đ</p>
      <p>${tour.departure_date} ${tour.departure_time} · ${formatDuration(tour.duration_minutes)} · ${tour.airline_name} · ${tour.aircraft_type}</p>
      <p><span class="price">${formatVND(tour.price)}</span></p>
    </div>
  `;

  const itinerary = await getTourItinerary(id);
  document.getElementById('itinerary').innerHTML = itinerary.map(it => `
    <div class="itinerary-day">
      <div class="itinerary-day-number">Ngày ${it.day_number}</div>
      <div>
        <h3>${it.title}</h3>
        <p>${it.description}</p>
      </div>
    </div>
  `).join('');

  document.getElementById('select-tour').addEventListener('click', async () => {
    await addToCart({ itemType: 'tour', itemId: tour.id, fareClass: null, price: tour.price });
    await updateCartBadge();
    showToast();
  });
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
