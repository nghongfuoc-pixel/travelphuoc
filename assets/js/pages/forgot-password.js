import { forgotPassword, renderAuthHeader } from '../auth.js';
import { updateCartBadge } from '../cart.js';

const form = document.getElementById('forgot-form');
const successBox = document.getElementById('forgot-success');
const errorBox = document.getElementById('forgot-error');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  successBox.classList.remove('show');
  errorBox.classList.remove('show');

  const email = document.getElementById('forgot-email').value.trim();
  const exists = await forgotPassword(email);

  if (exists) {
    successBox.textContent = `Đã gửi hướng dẫn đặt lại mật khẩu đến ${email} (mô phỏng, không gửi email thật).`;
    successBox.classList.add('show');
    form.reset();
  } else {
    errorBox.textContent = 'Không tìm thấy tài khoản với email này.';
    errorBox.classList.add('show');
  }
});

renderAuthHeader();
updateCartBadge();
