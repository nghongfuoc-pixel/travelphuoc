import { json, errorJson, readJson, toBindValue } from '../../lib/http.js';
import { getSessionUser } from '../../lib/auth.js';

const TOUR_FIELDS = [
  'name', 'operator', 'thumbnail_url', 'days', 'nights', 'price', 'origin', 'destination',
  'departure_date', 'departure_time', 'duration_minutes', 'airline_id', 'aircraft_type',
  'country_id', 'services', 'featured'
];

export async function onRequestGet({ params, env }) {
  const row = await env.DB.prepare(
    `SELECT t.*, a.name AS airline_name, a.logo_url AS airline_logo
     FROM tours t JOIN airlines a ON a.id = t.airline_id
     WHERE t.id = ?`
  ).bind(params.id).first();
  return json(row || null);
}

export async function onRequestPut(context) {
  const { request, params, env } = context;
  const user = await getSessionUser(context);
  if (!user || user.role !== 'admin') return errorJson('Không có quyền', 403);

  const body = await readJson(request);
  const assignments = TOUR_FIELDS.map(f => `${f} = ?`).join(', ');
  const values = TOUR_FIELDS.map(f => toBindValue(body[f]));

  await env.DB.prepare(`UPDATE tours SET ${assignments} WHERE id = ?`)
    .bind(...values, params.id).run();

  return json({ ok: true });
}

export async function onRequestDelete(context) {
  const { params, env } = context;
  const user = await getSessionUser(context);
  if (!user || user.role !== 'admin') return errorJson('Không có quyền', 403);

  await env.DB.prepare('DELETE FROM tour_itinerary WHERE tour_id = ?').bind(params.id).run();
  await env.DB.prepare('DELETE FROM tours WHERE id = ?').bind(params.id).run();
  return json({ ok: true });
}
