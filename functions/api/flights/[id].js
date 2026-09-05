import { json, errorJson, readJson } from '../../lib/http.js';
import { getSessionUser } from '../../lib/auth.js';

const FLIGHT_FIELDS = [
  'airline_id', 'origin', 'destination', 'departure_date', 'departure_time', 'arrival_time',
  'duration_minutes', 'trip_type', 'stop_type', 'aircraft_type', 'price_economy', 'price_business',
  'services', 'thumbnail_url'
];

export async function onRequestGet({ params, env }) {
  const row = await env.DB.prepare(
    `SELECT f.*, a.name AS airline_name, a.logo_url AS airline_logo
     FROM flights f JOIN airlines a ON a.id = f.airline_id
     WHERE f.id = ?`
  ).bind(params.id).first();
  return json(row || null);
}

export async function onRequestPut(context) {
  const { request, params, env } = context;
  const user = await getSessionUser(context);
  if (!user || user.role !== 'admin') return errorJson('Không có quyền', 403);

  const body = await readJson(request);
  const assignments = FLIGHT_FIELDS.map(f => `${f} = ?`).join(', ');
  const values = FLIGHT_FIELDS.map(f => body[f] ?? null);

  await env.DB.prepare(`UPDATE flights SET ${assignments} WHERE id = ?`)
    .bind(...values, params.id).run();

  return json({ ok: true });
}

export async function onRequestDelete(context) {
  const { params, env } = context;
  const user = await getSessionUser(context);
  if (!user || user.role !== 'admin') return errorJson('Không có quyền', 403);

  await env.DB.prepare('DELETE FROM flights WHERE id = ?').bind(params.id).run();
  return json({ ok: true });
}
