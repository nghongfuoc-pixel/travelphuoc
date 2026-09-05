import { json, errorJson, readJson } from '../../../lib/http.js';
import { getSessionUser } from '../../../lib/auth.js';

export async function onRequestPost(context) {
  const { request, params, env } = context;
  const user = await getSessionUser(context);
  if (!user) return errorJson('Vui lòng đăng nhập trước khi đặt chỗ.', 401);

  const order = await env.DB.prepare('SELECT user_id FROM orders WHERE id = ?').bind(params.id).first();
  if (!order || order.user_id !== user.id) return errorJson('Không tìm thấy đơn hàng', 404);

  const body = await readJson(request);
  const items = Array.isArray(body.items) ? body.items : [];
  if (!items.length) return json({ ok: true });

  const stmts = items.map(it => env.DB.prepare(
    'INSERT INTO order_items (order_id, item_type, item_id, fare_class, price) VALUES (?, ?, ?, ?, ?)'
  ).bind(params.id, it.item_type, it.item_id, it.fare_class ?? null, it.price));
  await env.DB.batch(stmts);

  return json({ ok: true }, 201);
}
