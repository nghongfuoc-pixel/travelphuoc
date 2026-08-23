import { supabase, getProfile } from './db/database.js';
import { validateUsername, validatePassword, validateEmail } from './validators.js';

function isAdminPage() {
  return window.location.pathname.includes('/admin/');
}

async function buildSession(supaUser) {
  if (!supaUser) return null;
  const profile = await getProfile(supaUser.id);
  if (!profile) return null;
  return {
    userId: supaUser.id,
    username: profile.username,
    email: supaUser.email,
    role: profile.role,
    fullName: profile.full_name,
    phone: profile.phone
  };
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error || !data.session) return null;
  return buildSession(data.session.user);
}

export async function logout() {
  await supabase.auth.signOut();
  window.location.href = (isAdminPage() ? '../' : '') + 'login.html';
}

function mapAuthError(err) {
  const msg = err?.message || '';
  if (msg.includes('Invalid login credentials')) return 'Tài khoản hoặc mật khẩu không đúng.';
  if (msg.includes('already registered') || msg.includes('duplicate key')) return 'Username hoặc email đã được sử dụng.';
  if (msg.includes('Email not confirmed')) return 'Vui lòng xác nhận email trước khi đăng nhập.';
  return msg || 'Đã có lỗi xảy ra.';
}

export async function login(identifier, password) {
  if (!identifier.includes('@')) {
    throw new Error('Vui lòng đăng nhập bằng email.');
  }
  const { data, error } = await supabase.auth.signInWithPassword({ email: identifier, password });
  if (error) throw new Error(mapAuthError(error));

  const session = await buildSession(data.user);
  if (!session) throw new Error('Không tìm thấy hồ sơ tài khoản.');
  return session;
}

export async function register({ username, email, password, fullName = '', phone = '' }) {
  const usernameError = validateUsername(username);
  if (usernameError) throw new Error(usernameError);

  const passwordError = validatePassword(password);
  if (passwordError) throw new Error(passwordError);

  const emailError = validateEmail(email);
  if (emailError) throw new Error(emailError);

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { username, full_name: fullName, phone } }
  });
  if (error) throw new Error(mapAuthError(error));
}

export async function forgotPassword(email) {
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  return !error;
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
