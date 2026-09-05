import { json, errorJson, readJson } from '../../../lib/http.js';
import { getSessionUser } from '../../../lib/auth.js';

export async function onRequestGet({ params, env }) {
  const { results } = await env.DB.prepare(
    'SELECT * FROM tour_itinerary WHERE tour_id = ? ORDER BY day_number'
  ).bind(params.id).all();
  return json(results);
}

export async function onRequestPost(context) {
  const { request, params, env } = context;
  const user = await getSessionUser(context);
  if (!user || user.role !== 'admin') return errorJson('Không có quyền', 403);

  const body = await readJson(request);
  const items = Array.isArray(body.items) ? body.items : [];
  if (!items.length) return json({ ok: true });

  const stmts = items.map(it => env.DB.prepare(
    'INSERT INTO tour_itinerary (tour_id, day_number, title, description) VALUES (?, ?, ?, ?)'
  ).bind(params.id, it.day, it.title, it.description));
  await env.DB.batch(stmts);

  return json({ ok: true }, 201);
}

export async function onRequestDelete(context) {
  const { params, env } = context;
  const user = await getSessionUser(context);
  if (!user || user.role !== 'admin') return errorJson('Không có quyền', 403);

  await env.DB.prepare('DELETE FROM tour_itinerary WHERE tour_id = ?').bind(params.id).run();
  return json({ ok: true });
}
