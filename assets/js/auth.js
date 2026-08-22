import { q, exec } from './db/database.js';
import { sha256Hex } from './crypto.js';
import { validateUsername, validatePassword, validateEmail } from './validators.js';

const SESSION_KEY = 'travelviet_auth_session';

function isAdminPage() {
  return window.location.pathname.includes('/admin/');
}

export function getSession() {
  const raw = sessionStorage.getItem(SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
}

function setSession(session) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function logout() {
  sessionStorage.removeItem(SESSION_KEY);
  window.location.href = (isAdminPage() ? '../' : '') + 'login.html';
}

export async function login(identifier, password) {
  const rows = await q('SELECT * FROM users WHERE email = ? OR username = ?', [identifier, identifier]);
  const user = rows[0];
  if (!user) throw new Error('Tài khoản không tồn tại.');

  const hash = await sha256Hex(password);
  if (hash !== user.password_hash) throw new Error('Mật khẩu không đúng.');

  const session = {
    userId: user.id, username: user.username, email: user.email,
    role: user.role, fullName: user.full_name, phone: user.phone
  };
  setSession(session);
  return session;
}

export async function register({ username, email, password, fullName = '', phone = '' }) {
  const usernameError = validateUsername(username);
  if (usernameError) throw new Error(usernameError);

  const passwordError = validatePassword(password);
  if (passwordError) throw new Error(passwordError);

  const emailError = validateEmail(email);
  if (emailError) throw new Error(emailError);

  const existing = await q('SELECT id FROM users WHERE email = ? OR username = ?', [email, username]);
  if (existing.length) throw new Error('Username hoặc email đã được sử dụng.');

  const hash = await sha256Hex(password);
  await exec(
    "INSERT INTO users (username, email, password_hash, full_name, phone, role, created_at) VALUES (?, ?, ?, ?, ?, 'user', ?)",
    [username, email, hash, fullName, phone, new Date().toISOString()]
  );
}

export async function forgotPassword(email) {
  const rows = await q('SELECT id FROM users WHERE email = ?', [email]);
  return rows.length > 0;
}

export function requireAuth(role = null) {
  const session = getSession();
  const prefix = isAdminPage() ? '../' : '';

  if (!session) {
    const redirect = encodeURIComponent(window.location.pathname.split('/').pop());
    window.location.href = `${prefix}login.html?redirect=${redirect}`;
    return null;
  }
  if (role && session.role !== role) {
    window.location.href = `${prefix}index.html`;
    return null;
  }
  return session;
}

export function renderAuthHeader() {
  const area = document.getElementById('auth-area');
  if (!area) return;

  const session = getSession();
  const prefix = isAdminPage() ? '../' : '';

  if (session) {
    area.innerHTML = `
      <span class="auth-hello">Xin chào, <strong>${session.username}</strong></span>
      ${session.role === 'admin' ? `<a href="${isAdminPage() ? 'dashboard.html' : 'admin/dashboard.html'}">Quản trị</a>` : ''}
      <a href="#" id="logout-link">Đăng xuất</a>
    `;
    document.getElementById('logout-link').addEventListener('click', (e) => {
      e.preventDefault();
      logout();
    });
  } else {
    area.innerHTML = `<a href="${prefix}login.html">Đăng nhập</a><a href="${prefix}register.html">Đăng ký</a>`;
  }
}
