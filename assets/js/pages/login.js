import { login, renderAuthHeader } from '../auth.js';
import { updateCartBadge } from '../cart.js';

const params = new URLSearchParams(window.location.search);
const redirect = params.get('redirect');

const form = document.getElementById('login-form');
const errorBox = document.getElementById('login-error');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  errorBox.classList.remove('show');

  const identifier = document.getElementById('login-identifier').value.trim();
  const password = document.getElementById('login-password').value;

  try {
    const session = await login(identifier, password);
    if (redirect) {
      window.location.href = redirect;
    } else if (session.role === 'admin') {
      window.location.href = 'admin/dashboard.html';
    } else {
      window.location.href = 'index.html';
    }
  } catch (err) {
    errorBox.textContent = err.message;
    errorBox.classList.add('show');
  }
});

renderAuthHeader();
updateCartBadge();
