import { getAdminFlightsWithAirline, deleteFlight } from '../../db/database.js';
import { formatVND } from '../../format.js';
import { requireAuth, logout } from '../../auth.js';

const session = await requireAuth('admin');

async function loadFlights() {
  const flights = await getAdminFlightsWithAirline();

  document.getElementById('flights-table-body').innerHTML = flights.map(f => `
    <tr>
      <td>${f.id}</td>
      <td>${f.airline_name}</td>
      <td>${f.origin} → ${f.destination}</td>
      <td>${f.departure_date} ${f.departure_time}</td>
      <td>${f.trip_type === 'roundtrip' ? 'Khứ hồi' : 'Một chiều'}</td>
      <td>${f.stop_type === 'direct' ? 'Bay thẳng' : 'Nhiều thành phố'}</td>
      <td>${formatVND(f.price_economy)}</td>
      <td>${formatVND(f.price_business)}</td>
      <td class="admin-table-actions">
        <a class="btn btn-outline" href="flight-form.html?id=${f.id}">Sửa</a>
        <button class="btn btn-outline" data-delete="${f.id}" style="color:var(--color-danger); border-color:var(--color-danger);">Xoá</button>
      </td>
    </tr>
  `).join('');

  document.querySelectorAll('[data-delete]').forEach(btn => {
    btn.addEventListener('click', async () => {
      if (!confirm('Xoá chuyến bay này? Hành động không thể hoàn tác.')) return;
      await deleteFlight(Number(btn.dataset.delete));
      loadFlights();
    });
  });
}

document.getElementById('admin-username').textContent = session.username;
document.getElementById('admin-logout').addEventListener('click', (e) => { e.preventDefault(); logout(); });

loadFlights();
