import { json, errorJson, readJson } from '../../lib/http.js';
import { getSessionUser } from '../../lib/auth.js';

export async function onRequestPost(context) {
  const { request, env } = context;
  const user = await getSessionUser(context);
  if (!user) return errorJson('Vui lòng đăng nhập trước khi đặt chỗ.', 401);

  const body = await readJson(request);
  const { name, email, phone, total } = body;
  if (!name || !email || !phone || total == null) return errorJson('Thiếu dữ liệu đơn hàng', 400);

  const result = await env.DB.prepare(
    `INSERT INTO orders (user_id, customer_name, email, phone, total_price, status)
     VALUES (?, ?, ?, ?, ?, 'confirmed')`
  ).bind(user.id, name, email, phone, total).run();

  return json({ id: result.meta.last_row_id }, 201);
}
