import { json, errorJson } from '../../lib/http.js';
import { getSessionUser } from '../../lib/auth.js';

export async function onRequestGet(context) {
  const { env } = context;
  const user = await getSessionUser(context);
  if (!user || user.role !== 'admin') return errorJson('Không có quyền', 403);

  const [toursThisMonth, flightsTotal, tourBookings, flightBookings] = await Promise.all([
    env.DB.prepare(
      `SELECT COUNT(*) AS c FROM tours WHERE strftime('%Y-%m', departure_date) = strftime('%Y-%m', 'now')`
    ).first(),
    env.DB.prepare('SELECT COUNT(*) AS c FROM flights').first(),
    env.DB.prepare(`SELECT COUNT(*) AS c FROM order_items WHERE item_type = 'tour'`).first(),
    env.DB.prepare(`SELECT COUNT(*) AS c FROM order_items WHERE item_type = 'flight'`).first()
  ]);

  return json({
    toursThisMonth: toursThisMonth.c,
    flightsTotal: flightsTotal.c,
    tourBookings: tourBookings.c,
    flightBookings: flightBookings.c
  });
}
