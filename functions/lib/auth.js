import { randomToken } from './crypto.js';

const COOKIE_NAME = 'tv_session';
const SESSION_DAYS = 30;

export function parseCookies(request) {
  const header = request.headers.get('Cookie') || '';
  const cookies = {};
  header.split(';').forEach(pair => {
    const idx = pair.indexOf('=');
    if (idx === -1) return;
    const key = pair.slice(0, idx).trim();
    const val = pair.slice(idx + 1).trim();
    if (key) cookies[key] = decodeURIComponent(val);
  });
  return cookies;
}

export async function createSession(env, userId) {
  const token = randomToken();
  const expires = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000).toISOString();
  await env.DB.prepare('INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)')
    .bind(token, userId, expires).run();
  return { token, expires };
}

export async function destroySession(env, token) {
  if (!token) return;
  await env.DB.prepare('DELETE FROM sessions WHERE token = ?').bind(token).run();
}

function isSecureRequest(request) {
  return new URL(request.url).protocol === 'https:';
}

export function sessionCookieHeader(request, token, expires) {
  const secure = isSecureRequest(request) ? '; Secure' : '';
  return `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax${secure}; Expires=${new Date(expires).toUTCString()}`;
}

export function clearSessionCookieHeader(request) {
  const secure = isSecureRequest(request) ? '; Secure' : '';
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax${secure}; Max-Age=0`;
}

export function getSessionToken(request) {
  return parseCookies(request)[COOKIE_NAME] || null;
}

export async function getSessionUser(context) {
  const { request, env } = context;
  const token = getSessionToken(request);
  if (!token) return null;

  const row = await env.DB.prepare(
    `SELECT u.id, u.username, u.email, u.role, u.full_name, u.phone
     FROM sessions s JOIN users u ON u.id = s.user_id
     WHERE s.token = ? AND s.expires_at > datetime('now')`
  ).bind(token).first();

  return row || null;
}

export function toSessionJson(user) {
  if (!user) return null;
  return {
    userId: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    fullName: user.full_name,
    phone: user.phone
  };
}
