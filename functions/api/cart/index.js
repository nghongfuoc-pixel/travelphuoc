import { json, errorJson, readJson } from '../../lib/http.js';

export async function onRequestGet({ request, env }) {
  const sessionId = new URL(request.url).searchParams.get('session_id');
  if (!sessionId) return errorJson('Thiếu session_id', 400);

  const { results } = await env.DB.prepare(
    'SELECT * FROM cart_items WHERE session_id = ? ORDER BY added_at DESC'
  ).bind(sessionId).all();
  return json(results);
}

export async function onRequestPost({ request, env }) {
  const body = await readJson(request);
  const { sessionId, itemType, itemId, fareClass = null, price } = body;
  if (!sessionId || !itemType || !itemId || price == null) {
    return errorJson('Thiếu dữ liệu giỏ hàng', 400);
  }

  await env.DB.prepare(
    'INSERT INTO cart_items (session_id, item_type, item_id, fare_class, price) VALUES (?, ?, ?, ?, ?)'
  ).bind(sessionId, itemType, itemId, fareClass, price).run();

  return json({ ok: true }, 201);
}

export async function onRequestDelete({ request, env }) {
  const sessionId = new URL(request.url).searchParams.get('session_id');
  if (!sessionId) return errorJson('Thiếu session_id', 400);

  await env.DB.prepare('DELETE FROM cart_items WHERE session_id = ?').bind(sessionId).run();
  return json({ ok: true });
}
