import { json } from '../../lib/http.js';

export async function onRequestDelete({ params, env }) {
  await env.DB.prepare('DELETE FROM cart_items WHERE id = ?').bind(params.id).run();
  return json({ ok: true });
}
