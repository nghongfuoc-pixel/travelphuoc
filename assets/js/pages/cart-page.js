import { getCartItems, removeCartItem, clearCart, checkout, updateCartBadge } from '../cart.js';
import { formatVND } from '../format.js';
import { getSession, renderAuthHeader } from '../auth.js';

async function prefillCustomerInfo() {
  const session = await getSession();
  if (!session) return;
  document.getElementById('customer-name').value = session.fullName || '';
  document.getElementById('customer-email').value = session.email || '';
  document.getElementById('customer-phone').value = session.phone || '';
}

async function render() {
  const items = await getCartItems();
  const container = document.getElementById('cart-items');
  const total = items.reduce((sum, it) => sum + it.price, 0);

  document.getElementById('cart-total').textContent = formatVND(total);
  document.getElementById('checkout-btn').disabled = items.length === 0;

  if (!items.length) {
    container.innerHTML = '<p class="empty-state">Giỏ hàng trống. <a href="index.html" style="color:var(--color-primary); font-weight:600;">Tìm chuyến bay hoặc tour ngay</a></p>';
    return;
  }

  container.innerHTML = items.map(it => {
    const isFlight = it.item_type === 'flight';
    const ref = isFlight ? it.flight : it.tour;
    if (!ref) return '';
    const title = isFlight ? `${ref.origin} → ${ref.destination}` : ref.name;
    const meta = isFlight
      ? `${ref.airline_name} · ${ref.departure_date} ${ref.departure_time} · Hạng ${it.fare_class === 'business' ? 'Thương gia' : 'Phổ thông'}`
      : `${ref.days}N${ref.nights}Đ · Khởi hành ${ref.departure_date}`;
    return `
      <div class="cart-item">
        <div style="flex:1">
          <div class="cart-item-title">${title}</div>
          <div class="cart-item-meta">${meta}</div>
        </div>
        <div class="cart-item-price">${formatVND(it.price)}</div>
        <button class="btn-icon" data-remove="${it.id}" aria-label="Xoá">✕</button>
      </div>
    `;
  }).join('');

  container.querySelectorAll('[data-remove]').forEach(btn => {
    btn.addEventListener('click', async () => {
      await removeCartItem(Number(btn.dataset.remove));
      await render();
      await updateCartBadge();
    });
  });
}

document.getElementById('clear-cart-btn').addEventListener('click', async () => {
  if (!confirm('Xoá toàn bộ giỏ hàng?')) return;
  await clearCart();
  await render();
  await updateCartBadge();
});

document.getElementById('checkout-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!(await getSession())) {
    window.location.href = 'login.html?redirect=cart.html';
    return;
  }

  const name = document.getElementById('customer-name').value.trim();
  const email = document.getElementById('customer-email').value.trim();
  const phone = document.getElementById('customer-phone').value.trim();
  if (!name || !email || !phone) return;

  const { total } = await checkout({ name, email, phone });
  document.getElementById('success-email').textContent = email;
  document.getElementById('success-total').textContent = formatVND(total);
  document.getElementById('success-modal').classList.add('show');

  await render();
  await updateCartBadge();
  e.target.reset();
});

document.getElementById('close-success').addEventListener('click', () => {
  window.location.href = 'index.html';
});

render();
updateCartBadge();
renderAuthHeader();
prefillCustomerInfo();
