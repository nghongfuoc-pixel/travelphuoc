export function validateUsername(username) {
  if (!username || username.length < 5 || username.length > 15) {
    return 'Username phải từ 5 đến 15 ký tự.';
  }
  if (!/^[A-Za-z0-9]+$/.test(username)) {
    return 'Username không được chứa ký tự đặc biệt hoặc khoảng trắng.';
  }
  return null;
}

export function validatePassword(password) {
  if (!password || password.length < 5 || password.length > 15) {
    return 'Password phải từ 5 đến 15 ký tự.';
  }
  return null;
}

export function validateEmail(email) {
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return 'Email không hợp lệ.';
  }
  return null;
}
