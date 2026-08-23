import { getProfile, updateProfile } from '../../db/database.js';
import { requireAuth, logout } from '../../auth.js';

const session = await requireAuth('admin');

async function load() {
  const user = await getProfile(session.userId);
  document.getElementById('f-username').value = user.username;
  document.getElementById('f-email').value = session.email;
  document.getElementById('f-fullname').value = user.full_name || '';
  document.getElementById('f-phone').value = user.phone || '';
  document.getElementById('f-role').value = user.role === 'admin' ? 'Quản trị viên' : 'Người dùng';
}

document.getElementById('profile-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const fullName = document.getElementById('f-fullname').value.trim();
  const phone = document.getElementById('f-phone').value.trim();

  await updateProfile(session.userId, { fullName, phone });

  const successBox = document.getElementById('profile-success');
  successBox.classList.add('show');
  setTimeout(() => successBox.classList.remove('show'), 3000);
});

document.getElementById('admin-username').textContent = session.username;
document.getElementById('admin-logout').addEventListener('click', (e) => { e.preventDefault(); logout(); });

load();
