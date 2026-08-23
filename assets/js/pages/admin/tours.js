import { getAdminTours, deleteTour } from '../../db/database.js';
import { formatVND } from '../../format.js';
import { requireAuth, logout } from '../../auth.js';

const session = await requireAuth('admin');

async function loadTours() {
  const tours = await getAdminTours();
  document.getElementById('tours-table-body').innerHTML = tours.map(t => `
    <tr>
      <td>${t.id}</td>
      <td>${t.name}</td>
      <td>${t.operator}</td>
      <td>${t.destination}</td>
      <td>${t.days}N${t.nights}Đ</td>
      <td>${formatVND(t.price)}</td>
      <td>${t.departure_date}</td>
      <td>${t.featured ? '⭐' : ''}</td>
      <td class="admin-table-actions">
        <a class="btn btn-outline" href="tour-form.html?id=${t.id}">Sửa</a>
        <button class="btn btn-outline" data-delete="${t.id}" style="color:var(--color-danger); border-color:var(--color-danger);">Xoá</button>
      </td>
    </tr>
  `).join('');

  document.querySelectorAll('[data-delete]').forEach(btn => {
    btn.addEventListener('click', async () => {
      if (!confirm('Xoá tour này? Hành động không thể hoàn tác.')) return;
      const id = Number(btn.dataset.delete);
      await deleteTour(id);
      loadTours();
    });
  });
}

document.getElementById('admin-username').textContent = session.username;
document.getElementById('admin-logout').addEventListener('click', (e) => { e.preventDefault(); logout(); });

loadTours();
