import { json, errorJson, readJson } from '../../lib/http.js';
import { verifyPassword } from '../../lib/crypto.js';
import { createSession, sessionCookieHeader, toSessionJson } from '../../lib/auth.js';

export async function onRequestPost({ request, env }) {
  const body = await readJson(request);
  const identifier = (body.identifier || '').trim();
  const password = body.password || '';

  if (!identifier.includes('@')) {
    return errorJson('Vui lòng đăng nhập bằng email.', 400);
  }

  const user = await env.DB.prepare('SELECT * FROM users WHERE email = ?').bind(identifier).first();
  if (!user || !(await verifyPassword(password, user.password_hash))) {
    return errorJson('Tài khoản hoặc mật khẩu không đúng.', 401);
  }

  const { token, expires } = await createSession(env, user.id);

  return new Response(JSON.stringify(toSessionJson(user)), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': sessionCookieHeader(request, token, expires)
    }
  });
}
