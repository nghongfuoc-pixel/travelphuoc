import { validateUsername, validatePassword, validateEmail } from './validators.js';

const API_BASE = '/api';

function isAdminPage() {
  return window.location.pathname.includes('/admin/');
}

async function apiSend(method, path, body) {
  const res = await fetch(API_BASE + path, {
    method,
    headers: body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
    body: body !== undefined ? JSON.stringify(body) : undefined
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(mapAuthError(data.error));
  return data;
}

function mapAuthError(message) {
  if (!message) return 'Đã có lỗi xảy ra.';
  if (message.includes('Username hoặc email đã được sử dụng')) return message;
  return message;
}

export async function getSession() {
  const res = await fetch(`${API_BASE}/auth/session`);
  if (!res.ok) return null;
  return res.json();
}

export async function logout() {
  await apiSend('POST', '/auth/logout');
  window.location.href = (isAdminPage() ? '../' : '') + 'login.html';
}

export async function login(identifier, password) {
  if (!identifier.includes('@')) {
    throw new Error('Vui lòng đăng nhập bằng email.');
  }
  return apiSend('POST', '/auth/login', { identifier, password });
}

export async function register({ username, email, password, fullName = '', phone = '' }) {
  const usernameError = validateUsername(username);
  if (usernameError) throw new Error(usernameError);

  const passwordError = validatePassword(password);
  if (passwordError) throw new Error(passwordError);

  const emailError = validateEmail(email);
  if (emailError) throw new Error(emailError);

  await apiSend('POST', '/auth/register', { username, email, password, fullName, phone });
}

export async function forgotPassword(email) {
  const { exists } = await apiSend('POST', '/auth/forgot-password', { email });
  return !!exists;
}

export async function requireAuth(role = null) {
  const session = await getSession();
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

export async function renderAuthHeader() {
  const area = document.getElementById('auth-area');
  if (!area) return;

  const session = await getSession();
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
