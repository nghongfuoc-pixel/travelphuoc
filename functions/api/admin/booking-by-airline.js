import { json, errorJson } from '../../lib/http.js';
import { getSessionUser } from '../../lib/auth.js';

export async function onRequestGet(context) {
  const { env } = context;
  const user = await getSessionUser(context);
  if (!user || user.role !== 'admin') return errorJson('Không có quyền', 403);

  const { results } = await env.DB.prepare(
    `SELECT a.name AS airline, COUNT(*) AS bookings
     FROM order_items oi
     JOIN flights f ON f.id = oi.item_id
     JOIN airlines a ON a.id = f.airline_id
     WHERE oi.item_type = 'flight'
     GROUP BY a.name
     ORDER BY bookings DESC
     LIMIT 10`
  ).all();

  return json(results);
}
