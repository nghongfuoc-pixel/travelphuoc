import { json, errorJson, readJson, toBindValue } from '../../lib/http.js';
import { getSessionUser } from '../../lib/auth.js';

const TOUR_FIELDS = [
  'name', 'operator', 'thumbnail_url', 'days', 'nights', 'price', 'origin', 'destination',
  'departure_date', 'departure_time', 'duration_minutes', 'airline_id', 'aircraft_type',
  'country_id', 'services', 'featured'
];

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);

  if (url.searchParams.get('featured') === '1') {
    const limit = Number(url.searchParams.get('limit') || 8);
    const { results } = await env.DB.prepare(
      'SELECT * FROM tours WHERE featured = 1 ORDER BY id LIMIT ?'
    ).bind(limit).all();
    return json(results);
  }

  if (url.searchParams.get('admin') === '1') {
    const { results } = await env.DB.prepare('SELECT * FROM tours ORDER BY id').all();
    return json(results);
  }

  const { results } = await env.DB.prepare(
    `SELECT t.*, a.name AS airline_name, a.logo_url AS airline_logo
     FROM tours t JOIN airlines a ON a.id = t.airline_id
     ORDER BY t.departure_date`
  ).all();
  return json(results);
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const user = await getSessionUser(context);
  if (!user || user.role !== 'admin') return errorJson('Không có quyền', 403);

  const body = await readJson(request);
  const values = TOUR_FIELDS.map(f => toBindValue(body[f]));
  const placeholders = TOUR_FIELDS.map(() => '?').join(', ');

  const result = await env.DB.prepare(
    `INSERT INTO tours (${TOUR_FIELDS.join(', ')}) VALUES (${placeholders})`
  ).bind(...values).run();

  return json({ id: result.meta.last_row_id }, 201);
}
