import { json, errorJson } from '../../lib/http.js';

export async function onRequestGet({ request, env }) {
  const sessionId = new URL(request.url).searchParams.get('session_id');
  if (!sessionId) return errorJson('Thiếu session_id', 400);

  const row = await env.DB.prepare(
    'SELECT COUNT(*) AS count FROM cart_items WHERE session_id = ?'
  ).bind(sessionId).first();
  return json({ count: row?.count || 0 });
}
