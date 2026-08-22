import { register, renderAuthHeader } from '../auth.js';
import { updateCartBadge } from '../cart.js';

const form = document.getElementById('register-form');
const errorBox = document.getElementById('register-error');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  errorBox.classList.remove('show');

  const username = document.getElementById('reg-username').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const password = document.getElementById('reg-password').value;
  const confirm = document.getElementById('reg-confirm').value;

  if (password !== confirm) {
    errorBox.textContent = 'Mật khẩu xác nhận không khớp.';
    errorBox.classList.add('show');
    return;
  }

  try {
    await register({ username, email, password });
    window.location.href = 'login.html';
  } catch (err) {
    errorBox.textContent = err.message;
    errorBox.classList.add('show');
  }
});

renderAuthHeader();
updateCartBadge();
