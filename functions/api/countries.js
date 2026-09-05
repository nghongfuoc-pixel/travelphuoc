import { json } from '../lib/http.js';

export async function onRequestGet({ env }) {
  const { results } = await env.DB.prepare('SELECT * FROM countries ORDER BY name').all();
  return json(results);
}
