import { json } from '../../lib/http.js';
import { getSessionUser, toSessionJson } from '../../lib/auth.js';

export async function onRequestGet(context) {
  const user = await getSessionUser(context);
  return json(toSessionJson(user));
}
