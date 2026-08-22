import { q, exec } from './db/database.js';

const SESSION_KEY = 'travelviet_session_id';

export function getSessionId() {
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = 'guest-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export async function addToCart({ itemType, itemId, fareClass = null, price }) {
  await exec(
    'INSERT INTO cart_items (session_id, item_type, item_id, fare_class, price, added_at) VALUES (?, ?, ?, ?, ?, ?)',
    [getSessionId(), itemType, itemId, fareClass, price, new Date().toISOString()]
  );
}

export async function getCartItems() {
  const rows = await q('SELECT * FROM cart_items WHERE session_id = ? ORDER BY added_at DESC', [getSessionId()]);
  const detailed = [];
  for (const row of rows) {
    if (row.item_type === 'flight') {
      const [flight] = await q(
        'SELECT f.*, a.name AS airline_name FROM flights f JOIN airlines a ON a.id = f.airline_id WHERE f.id = ?',
        [row.item_id]
      );
      detailed.push({ ...row, flight });
    } else {
      const [tour] = await q('SELECT * FROM tours WHERE id = ?', [row.item_id]);
      detailed.push({ ...row, tour });
    }
  }
  return detailed;
}

export async function removeCartItem(id) {
  await exec('DELETE FROM cart_items WHERE id = ?', [id]);
}

export async function clearCart() {
  await exec('DELETE FROM cart_items WHERE session_id = ?', [getSessionId()]);
}

export async function cartCount() {
  const rows = await q('SELECT COUNT(*) AS c FROM cart_items WHERE session_id = ?', [getSessionId()]);
  return rows[0].c;
}

export async function checkout({ name, email, phone }) {
  const items = await getCartItems();
  const total = items.reduce((sum, it) => sum + it.price, 0);
  const now = new Date().toISOString();

  await exec(
    "INSERT INTO orders (customer_name, email, phone, total_price, status, created_at) VALUES (?, ?, ?, ?, 'confirmed', ?)",
    [name, email, phone, total, now]
  );
  const [{ id: orderId }] = await q('SELECT id FROM orders ORDER BY id DESC LIMIT 1');

  for (const it of items) {
    await exec(
      'INSERT INTO order_items (order_id, item_type, item_id, fare_class, price) VALUES (?, ?, ?, ?, ?)',
      [orderId, it.item_type, it.item_id, it.fare_class, it.price]
    );
  }

  await clearCart();
  return { orderId, total };
}

export async function updateCartBadge() {
  const badge = document.getElementById('cart-count');
  if (!badge) return;
  const count = await cartCount();
  badge.textContent = count;
  badge.style.display = count > 0 ? 'inline-flex' : 'none';
}
