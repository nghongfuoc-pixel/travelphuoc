import {
  getCartItemsBySession, addCartItem, removeCartItem as removeCartItemDb, clearCartBySession,
  cartCountBySession, getFlightById, getTourById, createOrder, createOrderItems
} from './db/database.js';
import { getSession } from './auth.js';

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
  await addCartItem({ sessionId: getSessionId(), itemType, itemId, fareClass, price });
}

export async function getCartItems() {
  const rows = await getCartItemsBySession(getSessionId());
  const detailed = [];
  for (const row of rows) {
    if (row.item_type === 'flight') {
      const flight = await getFlightById(row.item_id);
      detailed.push({ ...row, flight });
    } else {
      const tour = await getTourById(row.item_id);
      detailed.push({ ...row, tour });
    }
  }
  return detailed;
}

export async function removeCartItem(id) {
  await removeCartItemDb(id);
}

export async function clearCart() {
  await clearCartBySession(getSessionId());
}

export async function cartCount() {
  return cartCountBySession(getSessionId());
}

export async function checkout({ name, email, phone }) {
  const session = await getSession();
  if (!session) throw new Error('Vui lòng đăng nhập trước khi đặt chỗ.');

  const items = await getCartItems();
  const total = items.reduce((sum, it) => sum + it.price, 0);

  const orderId = await createOrder({ userId: session.userId, name, email, phone, total });
  await createOrderItems(orderId, items);
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
