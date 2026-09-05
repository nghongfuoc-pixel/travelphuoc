import { json, errorJson, readJson } from '../lib/http.js';
import { getSessionUser } from '../lib/auth.js';

export async function onRequestGet(context) {
  const { request, env } = context;
  const user = await getSessionUser(context);
  if (!user) return errorJson('Chưa đăng nhập', 401);

  const targetId = new URL(request.url).searchParams.get('userId') || user.id;
  if (Number(targetId) !== user.id && user.role !== 'admin') return errorJson('Không có quyền', 403);

  const row = await env.DB.prepare(
    'SELECT id, username, email, full_name, phone, role FROM users WHERE id = ?'
  ).bind(targetId).first();

  return json(row || null);
}

export async function onRequestPut(context) {
  const { request, env } = context;
  const user = await getSessionUser(context);
  if (!user) return errorJson('Chưa đăng nhập', 401);

  const body = await readJson(request);
  const targetId = body.userId || user.id;
  if (Number(targetId) !== user.id && user.role !== 'admin') return errorJson('Không có quyền', 403);

  await env.DB.prepare('UPDATE users SET full_name = ?, phone = ? WHERE id = ?')
    .bind(body.fullName ?? null, body.phone ?? null, targetId).run();

  return json({ ok: true });
}
