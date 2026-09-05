import { json, errorJson, readJson } from '../../lib/http.js';
import { hashPassword } from '../../lib/crypto.js';
import { validateUsername, validatePassword, validateEmail } from '../../../assets/js/validators.js';

export async function onRequestPost({ request, env }) {
  const body = await readJson(request);
  const username = (body.username || '').trim();
  const email = (body.email || '').trim();
  const password = body.password || '';
  const fullName = body.fullName || '';
  const phone = body.phone || '';

  const usernameError = validateUsername(username);
  if (usernameError) return errorJson(usernameError, 400);

  const passwordError = validatePassword(password);
  if (passwordError) return errorJson(passwordError, 400);

  const emailError = validateEmail(email);
  if (emailError) return errorJson(emailError, 400);

  const existing = await env.DB.prepare(
    'SELECT id FROM users WHERE username = ? OR email = ?'
  ).bind(username, email).first();
  if (existing) return errorJson('Username hoặc email đã được sử dụng.', 409);

  const passwordHash = await hashPassword(password);

  await env.DB.prepare(
    `INSERT INTO users (username, email, password_hash, full_name, phone, role)
     VALUES (?, ?, ?, ?, ?, 'user')`
  ).bind(username, email, passwordHash, fullName, phone).run();

  return json({ ok: true }, 201);
}
