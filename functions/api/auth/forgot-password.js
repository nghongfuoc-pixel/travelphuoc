import { json, readJson } from '../../lib/http.js';

export async function onRequestPost({ request, env }) {
  const body = await readJson(request);
  const email = (body.email || '').trim();

  const user = await env.DB.prepare('SELECT id FROM users WHERE email = ?').bind(email).first();

  // Mô phỏng gửi email đặt lại mật khẩu — không gửi email thật (giống flow xác nhận đơn hàng).
  return json({ exists: !!user });
}
