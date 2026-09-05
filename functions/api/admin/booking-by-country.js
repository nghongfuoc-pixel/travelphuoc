import { json, errorJson } from '../../lib/http.js';
import { getSessionUser } from '../../lib/auth.js';

export async function onRequestGet(context) {
  const { env } = context;
  const user = await getSessionUser(context);
  if (!user || user.role !== 'admin') return errorJson('Không có quyền', 403);

  const { results } = await env.DB.prepare(
    `SELECT c.name AS country,
            COUNT(*) AS booking_count,
            COUNT(DISTINCT t.id) AS tour_count
     FROM order_items oi
     JOIN tours t ON t.id = oi.item_id
     JOIN countries c ON c.id = t.country_id
     WHERE oi.item_type = 'tour'
     GROUP BY c.name
     ORDER BY booking_count DESC`
  ).all();

  return json(results);
}
