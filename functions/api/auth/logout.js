import { getSessionToken, destroySession, clearSessionCookieHeader } from '../../lib/auth.js';

export async function onRequestPost({ request, env }) {
  const token = getSessionToken(request);
  await destroySession(env, token);

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': clearSessionCookieHeader(request)
    }
  });
}
