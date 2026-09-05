import { json, errorJson, readJson } from '../../lib/http.js';
import { getSessionUser } from '../../lib/auth.js';

const FLIGHT_FIELDS = [
  'airline_id', 'origin', 'destination', 'departure_date', 'departure_time', 'arrival_time',
  'duration_minutes', 'trip_type', 'stop_type', 'aircraft_type', 'price_economy', 'price_business',
  'services', 'thumbnail_url'
];

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);

  if (url.searchParams.get('routePoints') === '1') {
    const { results } = await env.DB.prepare('SELECT origin, destination FROM flights').all();
    const origins = [...new Set(results.map(r => r.origin))].sort();
    const destinations = [...new Set(results.map(r => r.destination))].sort();
    return json({ origins, destinations });
  }

  if (url.searchParams.get('admin') === '1') {
    const { results } = await env.DB.prepare(
      `SELECT f.*, a.name AS airline_name, a.logo_url AS airline_logo
       FROM flights f JOIN airlines a ON a.id = f.airline_id
       ORDER BY f.id`
    ).all();
    return json(results);
  }

  const { results } = await env.DB.prepare(
    `SELECT f.*, a.name AS airline_name, a.logo_url AS airline_logo
     FROM flights f JOIN airlines a ON a.id = f.airline_id
     ORDER BY f.departure_date, f.departure_time`
  ).all();
  return json(results);
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const user = await getSessionUser(context);
  if (!user || user.role !== 'admin') return errorJson('Không có quyền', 403);

  const body = await readJson(request);
  const values = FLIGHT_FIELDS.map(f => body[f] ?? null);
  const placeholders = FLIGHT_FIELDS.map(() => '?').join(', ');

  const result = await env.DB.prepare(
    `INSERT INTO flights (${FLIGHT_FIELDS.join(', ')}) VALUES (${placeholders})`
  ).bind(...values).run();

  return json({ id: result.meta.last_row_id }, 201);
}
