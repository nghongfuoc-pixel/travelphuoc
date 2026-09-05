var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// .wrangler/tmp/pages-b0Gmqi/functionsWorker-0.5390316159523036.mjs
var __defProp2 = Object.defineProperty;
var __name2 = /* @__PURE__ */ __name((target, value) => __defProp2(target, "name", { value, configurable: true }), "__name");
function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}
__name(json, "json");
__name2(json, "json");
function errorJson(message, status = 400) {
  return json({ error: message }, status);
}
__name(errorJson, "errorJson");
__name2(errorJson, "errorJson");
async function readJson(request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}
__name(readJson, "readJson");
__name2(readJson, "readJson");
function toBindValue(v) {
  if (typeof v === "boolean") return v ? 1 : 0;
  return v ?? null;
}
__name(toBindValue, "toBindValue");
__name2(toBindValue, "toBindValue");
var ITERATIONS = 1e5;
function toBase64(buf) {
  return btoa(String.fromCharCode(...new Uint8Array(buf)));
}
__name(toBase64, "toBase64");
__name2(toBase64, "toBase64");
function fromBase64(str) {
  return Uint8Array.from(atob(str), (c) => c.charCodeAt(0));
}
__name(fromBase64, "fromBase64");
__name2(fromBase64, "fromBase64");
async function deriveBits(password, salt, iterations) {
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  return crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations, hash: "SHA-256" },
    keyMaterial,
    256
  );
}
__name(deriveBits, "deriveBits");
__name2(deriveBits, "deriveBits");
async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const bits = await deriveBits(password, salt, ITERATIONS);
  return `pbkdf2$${ITERATIONS}$${toBase64(salt)}$${toBase64(bits)}`;
}
__name(hashPassword, "hashPassword");
__name2(hashPassword, "hashPassword");
async function verifyPassword(password, stored) {
  const parts = String(stored || "").split("$");
  if (parts.length !== 4 || parts[0] !== "pbkdf2") return false;
  const iterations = Number(parts[1]);
  const salt = fromBase64(parts[2]);
  const bits = await deriveBits(password, salt, iterations);
  return toBase64(bits) === parts[3];
}
__name(verifyPassword, "verifyPassword");
__name2(verifyPassword, "verifyPassword");
function randomToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return toBase64(bytes).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
__name(randomToken, "randomToken");
__name2(randomToken, "randomToken");
var COOKIE_NAME = "tv_session";
var SESSION_DAYS = 30;
function parseCookies(request) {
  const header = request.headers.get("Cookie") || "";
  const cookies = {};
  header.split(";").forEach((pair) => {
    const idx = pair.indexOf("=");
    if (idx === -1) return;
    const key = pair.slice(0, idx).trim();
    const val = pair.slice(idx + 1).trim();
    if (key) cookies[key] = decodeURIComponent(val);
  });
  return cookies;
}
__name(parseCookies, "parseCookies");
__name2(parseCookies, "parseCookies");
async function createSession(env, userId) {
  const token = randomToken();
  const expires = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1e3).toISOString();
  await env.DB.prepare("INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)").bind(token, userId, expires).run();
  return { token, expires };
}
__name(createSession, "createSession");
__name2(createSession, "createSession");
async function destroySession(env, token) {
  if (!token) return;
  await env.DB.prepare("DELETE FROM sessions WHERE token = ?").bind(token).run();
}
__name(destroySession, "destroySession");
__name2(destroySession, "destroySession");
function isSecureRequest(request) {
  return new URL(request.url).protocol === "https:";
}
__name(isSecureRequest, "isSecureRequest");
__name2(isSecureRequest, "isSecureRequest");
function sessionCookieHeader(request, token, expires) {
  const secure = isSecureRequest(request) ? "; Secure" : "";
  return `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax${secure}; Expires=${new Date(expires).toUTCString()}`;
}
__name(sessionCookieHeader, "sessionCookieHeader");
__name2(sessionCookieHeader, "sessionCookieHeader");
function clearSessionCookieHeader(request) {
  const secure = isSecureRequest(request) ? "; Secure" : "";
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax${secure}; Max-Age=0`;
}
__name(clearSessionCookieHeader, "clearSessionCookieHeader");
__name2(clearSessionCookieHeader, "clearSessionCookieHeader");
function getSessionToken(request) {
  return parseCookies(request)[COOKIE_NAME] || null;
}
__name(getSessionToken, "getSessionToken");
__name2(getSessionToken, "getSessionToken");
async function getSessionUser(context) {
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
__name(getSessionUser, "getSessionUser");
__name2(getSessionUser, "getSessionUser");
function toSessionJson(user) {
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
__name(toSessionJson, "toSessionJson");
__name2(toSessionJson, "toSessionJson");
async function onRequestPost(context) {
  const { request, params, env } = context;
  const user = await getSessionUser(context);
  if (!user) return errorJson("Vui l\xF2ng \u0111\u0103ng nh\u1EADp tr\u01B0\u1EDBc khi \u0111\u1EB7t ch\u1ED7.", 401);
  const order = await env.DB.prepare("SELECT user_id FROM orders WHERE id = ?").bind(params.id).first();
  if (!order || order.user_id !== user.id) return errorJson("Kh\xF4ng t\xECm th\u1EA5y \u0111\u01A1n h\xE0ng", 404);
  const body = await readJson(request);
  const items = Array.isArray(body.items) ? body.items : [];
  if (!items.length) return json({ ok: true });
  const stmts = items.map((it) => env.DB.prepare(
    "INSERT INTO order_items (order_id, item_type, item_id, fare_class, price) VALUES (?, ?, ?, ?, ?)"
  ).bind(params.id, it.item_type, it.item_id, it.fare_class ?? null, it.price));
  await env.DB.batch(stmts);
  return json({ ok: true }, 201);
}
__name(onRequestPost, "onRequestPost");
__name2(onRequestPost, "onRequestPost");
async function onRequestGet({ params, env }) {
  const { results } = await env.DB.prepare(
    "SELECT * FROM tour_itinerary WHERE tour_id = ? ORDER BY day_number"
  ).bind(params.id).all();
  return json(results);
}
__name(onRequestGet, "onRequestGet");
__name2(onRequestGet, "onRequestGet");
async function onRequestPost2(context) {
  const { request, params, env } = context;
  const user = await getSessionUser(context);
  if (!user || user.role !== "admin") return errorJson("Kh\xF4ng c\xF3 quy\u1EC1n", 403);
  const body = await readJson(request);
  const items = Array.isArray(body.items) ? body.items : [];
  if (!items.length) return json({ ok: true });
  const stmts = items.map((it) => env.DB.prepare(
    "INSERT INTO tour_itinerary (tour_id, day_number, title, description) VALUES (?, ?, ?, ?)"
  ).bind(params.id, it.day, it.title, it.description));
  await env.DB.batch(stmts);
  return json({ ok: true }, 201);
}
__name(onRequestPost2, "onRequestPost2");
__name2(onRequestPost2, "onRequestPost");
async function onRequestDelete(context) {
  const { params, env } = context;
  const user = await getSessionUser(context);
  if (!user || user.role !== "admin") return errorJson("Kh\xF4ng c\xF3 quy\u1EC1n", 403);
  await env.DB.prepare("DELETE FROM tour_itinerary WHERE tour_id = ?").bind(params.id).run();
  return json({ ok: true });
}
__name(onRequestDelete, "onRequestDelete");
__name2(onRequestDelete, "onRequestDelete");
async function onRequestGet2(context) {
  const { env } = context;
  const user = await getSessionUser(context);
  if (!user || user.role !== "admin") return errorJson("Kh\xF4ng c\xF3 quy\u1EC1n", 403);
  const { results } = await env.DB.prepare(
    `SELECT a.name AS airline, COUNT(*) AS bookings
     FROM order_items oi
     JOIN flights f ON f.id = oi.item_id
     JOIN airlines a ON a.id = f.airline_id
     WHERE oi.item_type = 'flight'
     GROUP BY a.name
     ORDER BY bookings DESC
     LIMIT 10`
  ).all();
  return json(results);
}
__name(onRequestGet2, "onRequestGet2");
__name2(onRequestGet2, "onRequestGet");
async function onRequestGet3(context) {
  const { env } = context;
  const user = await getSessionUser(context);
  if (!user || user.role !== "admin") return errorJson("Kh\xF4ng c\xF3 quy\u1EC1n", 403);
  const { results } = await env.DB.prepare(
    `SELECT c.name AS country,
            COUNT(*) AS booking_count,
            COUNT(DISTINCT t.id) AS tour_count
     FROM order_items oi
     JOIN tours t ON t.id = oi.item_id
     JOIN countries c ON c.id = t.country_id
     WHERE oi.item_type = 'tour'
     GROUP BY c.name
     ORDER BY booking_count DESC`
  ).all();
  return json(results);
}
__name(onRequestGet3, "onRequestGet3");
__name2(onRequestGet3, "onRequestGet");
async function onRequestGet4(context) {
  const { env } = context;
  const user = await getSessionUser(context);
  if (!user || user.role !== "admin") return errorJson("Kh\xF4ng c\xF3 quy\u1EC1n", 403);
  const [toursThisMonth, flightsTotal, tourBookings, flightBookings] = await Promise.all([
    env.DB.prepare(
      `SELECT COUNT(*) AS c FROM tours WHERE strftime('%Y-%m', departure_date) = strftime('%Y-%m', 'now')`
    ).first(),
    env.DB.prepare("SELECT COUNT(*) AS c FROM flights").first(),
    env.DB.prepare(`SELECT COUNT(*) AS c FROM order_items WHERE item_type = 'tour'`).first(),
    env.DB.prepare(`SELECT COUNT(*) AS c FROM order_items WHERE item_type = 'flight'`).first()
  ]);
  return json({
    toursThisMonth: toursThisMonth.c,
    flightsTotal: flightsTotal.c,
    tourBookings: tourBookings.c,
    flightBookings: flightBookings.c
  });
}
__name(onRequestGet4, "onRequestGet4");
__name2(onRequestGet4, "onRequestGet");
async function onRequestPost3({ request, env }) {
  const body = await readJson(request);
  const email = (body.email || "").trim();
  const user = await env.DB.prepare("SELECT id FROM users WHERE email = ?").bind(email).first();
  return json({ exists: !!user });
}
__name(onRequestPost3, "onRequestPost3");
__name2(onRequestPost3, "onRequestPost");
async function onRequestPost4({ request, env }) {
  const body = await readJson(request);
  const identifier = (body.identifier || "").trim();
  const password = body.password || "";
  if (!identifier.includes("@")) {
    return errorJson("Vui l\xF2ng \u0111\u0103ng nh\u1EADp b\u1EB1ng email.", 400);
  }
  const user = await env.DB.prepare("SELECT * FROM users WHERE email = ?").bind(identifier).first();
  if (!user || !await verifyPassword(password, user.password_hash)) {
    return errorJson("T\xE0i kho\u1EA3n ho\u1EB7c m\u1EADt kh\u1EA9u kh\xF4ng \u0111\xFAng.", 401);
  }
  const { token, expires } = await createSession(env, user.id);
  return new Response(JSON.stringify(toSessionJson(user)), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": sessionCookieHeader(request, token, expires)
    }
  });
}
__name(onRequestPost4, "onRequestPost4");
__name2(onRequestPost4, "onRequestPost");
async function onRequestPost5({ request, env }) {
  const token = getSessionToken(request);
  await destroySession(env, token);
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": clearSessionCookieHeader(request)
    }
  });
}
__name(onRequestPost5, "onRequestPost5");
__name2(onRequestPost5, "onRequestPost");
function validateUsername(username) {
  if (!username || username.length < 5 || username.length > 15) {
    return "Username ph\u1EA3i t\u1EEB 5 \u0111\u1EBFn 15 k\xFD t\u1EF1.";
  }
  if (!/^[A-Za-z0-9]+$/.test(username)) {
    return "Username kh\xF4ng \u0111\u01B0\u1EE3c ch\u1EE9a k\xFD t\u1EF1 \u0111\u1EB7c bi\u1EC7t ho\u1EB7c kho\u1EA3ng tr\u1EAFng.";
  }
  return null;
}
__name(validateUsername, "validateUsername");
__name2(validateUsername, "validateUsername");
function validatePassword(password) {
  if (!password || password.length < 5 || password.length > 15) {
    return "Password ph\u1EA3i t\u1EEB 5 \u0111\u1EBFn 15 k\xFD t\u1EF1.";
  }
  return null;
}
__name(validatePassword, "validatePassword");
__name2(validatePassword, "validatePassword");
function validateEmail(email) {
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "Email kh\xF4ng h\u1EE3p l\u1EC7.";
  }
  return null;
}
__name(validateEmail, "validateEmail");
__name2(validateEmail, "validateEmail");
async function onRequestPost6({ request, env }) {
  const body = await readJson(request);
  const username = (body.username || "").trim();
  const email = (body.email || "").trim();
  const password = body.password || "";
  const fullName = body.fullName || "";
  const phone = body.phone || "";
  const usernameError = validateUsername(username);
  if (usernameError) return errorJson(usernameError, 400);
  const passwordError = validatePassword(password);
  if (passwordError) return errorJson(passwordError, 400);
  const emailError = validateEmail(email);
  if (emailError) return errorJson(emailError, 400);
  const existing = await env.DB.prepare(
    "SELECT id FROM users WHERE username = ? OR email = ?"
  ).bind(username, email).first();
  if (existing) return errorJson("Username ho\u1EB7c email \u0111\xE3 \u0111\u01B0\u1EE3c s\u1EED d\u1EE5ng.", 409);
  const passwordHash = await hashPassword(password);
  await env.DB.prepare(
    `INSERT INTO users (username, email, password_hash, full_name, phone, role)
     VALUES (?, ?, ?, ?, ?, 'user')`
  ).bind(username, email, passwordHash, fullName, phone).run();
  return json({ ok: true }, 201);
}
__name(onRequestPost6, "onRequestPost6");
__name2(onRequestPost6, "onRequestPost");
async function onRequestGet5(context) {
  const user = await getSessionUser(context);
  return json(toSessionJson(user));
}
__name(onRequestGet5, "onRequestGet5");
__name2(onRequestGet5, "onRequestGet");
async function onRequestGet6({ request, env }) {
  const sessionId = new URL(request.url).searchParams.get("session_id");
  if (!sessionId) return errorJson("Thi\u1EBFu session_id", 400);
  const row = await env.DB.prepare(
    "SELECT COUNT(*) AS count FROM cart_items WHERE session_id = ?"
  ).bind(sessionId).first();
  return json({ count: row?.count || 0 });
}
__name(onRequestGet6, "onRequestGet6");
__name2(onRequestGet6, "onRequestGet");
async function onRequestDelete2({ params, env }) {
  await env.DB.prepare("DELETE FROM cart_items WHERE id = ?").bind(params.id).run();
  return json({ ok: true });
}
__name(onRequestDelete2, "onRequestDelete2");
__name2(onRequestDelete2, "onRequestDelete");
var FLIGHT_FIELDS = [
  "airline_id",
  "origin",
  "destination",
  "departure_date",
  "departure_time",
  "arrival_time",
  "duration_minutes",
  "trip_type",
  "stop_type",
  "aircraft_type",
  "price_economy",
  "price_business",
  "services",
  "thumbnail_url"
];
async function onRequestGet7({ params, env }) {
  const row = await env.DB.prepare(
    `SELECT f.*, a.name AS airline_name, a.logo_url AS airline_logo
     FROM flights f JOIN airlines a ON a.id = f.airline_id
     WHERE f.id = ?`
  ).bind(params.id).first();
  return json(row || null);
}
__name(onRequestGet7, "onRequestGet7");
__name2(onRequestGet7, "onRequestGet");
async function onRequestPut(context) {
  const { request, params, env } = context;
  const user = await getSessionUser(context);
  if (!user || user.role !== "admin") return errorJson("Kh\xF4ng c\xF3 quy\u1EC1n", 403);
  const body = await readJson(request);
  const assignments = FLIGHT_FIELDS.map((f) => `${f} = ?`).join(", ");
  const values = FLIGHT_FIELDS.map((f) => body[f] ?? null);
  await env.DB.prepare(`UPDATE flights SET ${assignments} WHERE id = ?`).bind(...values, params.id).run();
  return json({ ok: true });
}
__name(onRequestPut, "onRequestPut");
__name2(onRequestPut, "onRequestPut");
async function onRequestDelete3(context) {
  const { params, env } = context;
  const user = await getSessionUser(context);
  if (!user || user.role !== "admin") return errorJson("Kh\xF4ng c\xF3 quy\u1EC1n", 403);
  await env.DB.prepare("DELETE FROM flights WHERE id = ?").bind(params.id).run();
  return json({ ok: true });
}
__name(onRequestDelete3, "onRequestDelete3");
__name2(onRequestDelete3, "onRequestDelete");
var TOUR_FIELDS = [
  "name",
  "operator",
  "thumbnail_url",
  "days",
  "nights",
  "price",
  "origin",
  "destination",
  "departure_date",
  "departure_time",
  "duration_minutes",
  "airline_id",
  "aircraft_type",
  "country_id",
  "services",
  "featured"
];
async function onRequestGet8({ params, env }) {
  const row = await env.DB.prepare(
    `SELECT t.*, a.name AS airline_name, a.logo_url AS airline_logo
     FROM tours t JOIN airlines a ON a.id = t.airline_id
     WHERE t.id = ?`
  ).bind(params.id).first();
  return json(row || null);
}
__name(onRequestGet8, "onRequestGet8");
__name2(onRequestGet8, "onRequestGet");
async function onRequestPut2(context) {
  const { request, params, env } = context;
  const user = await getSessionUser(context);
  if (!user || user.role !== "admin") return errorJson("Kh\xF4ng c\xF3 quy\u1EC1n", 403);
  const body = await readJson(request);
  const assignments = TOUR_FIELDS.map((f) => `${f} = ?`).join(", ");
  const values = TOUR_FIELDS.map((f) => toBindValue(body[f]));
  await env.DB.prepare(`UPDATE tours SET ${assignments} WHERE id = ?`).bind(...values, params.id).run();
  return json({ ok: true });
}
__name(onRequestPut2, "onRequestPut2");
__name2(onRequestPut2, "onRequestPut");
async function onRequestDelete4(context) {
  const { params, env } = context;
  const user = await getSessionUser(context);
  if (!user || user.role !== "admin") return errorJson("Kh\xF4ng c\xF3 quy\u1EC1n", 403);
  await env.DB.prepare("DELETE FROM tour_itinerary WHERE tour_id = ?").bind(params.id).run();
  await env.DB.prepare("DELETE FROM tours WHERE id = ?").bind(params.id).run();
  return json({ ok: true });
}
__name(onRequestDelete4, "onRequestDelete4");
__name2(onRequestDelete4, "onRequestDelete");
async function onRequestGet9({ env }) {
  const { results } = await env.DB.prepare("SELECT * FROM airlines ORDER BY name").all();
  return json(results);
}
__name(onRequestGet9, "onRequestGet9");
__name2(onRequestGet9, "onRequestGet");
async function onRequestGet10({ request, env }) {
  const sessionId = new URL(request.url).searchParams.get("session_id");
  if (!sessionId) return errorJson("Thi\u1EBFu session_id", 400);
  const { results } = await env.DB.prepare(
    "SELECT * FROM cart_items WHERE session_id = ? ORDER BY added_at DESC"
  ).bind(sessionId).all();
  return json(results);
}
__name(onRequestGet10, "onRequestGet10");
__name2(onRequestGet10, "onRequestGet");
async function onRequestPost7({ request, env }) {
  const body = await readJson(request);
  const { sessionId, itemType, itemId, fareClass = null, price } = body;
  if (!sessionId || !itemType || !itemId || price == null) {
    return errorJson("Thi\u1EBFu d\u1EEF li\u1EC7u gi\u1ECF h\xE0ng", 400);
  }
  await env.DB.prepare(
    "INSERT INTO cart_items (session_id, item_type, item_id, fare_class, price) VALUES (?, ?, ?, ?, ?)"
  ).bind(sessionId, itemType, itemId, fareClass, price).run();
  return json({ ok: true }, 201);
}
__name(onRequestPost7, "onRequestPost7");
__name2(onRequestPost7, "onRequestPost");
async function onRequestDelete5({ request, env }) {
  const sessionId = new URL(request.url).searchParams.get("session_id");
  if (!sessionId) return errorJson("Thi\u1EBFu session_id", 400);
  await env.DB.prepare("DELETE FROM cart_items WHERE session_id = ?").bind(sessionId).run();
  return json({ ok: true });
}
__name(onRequestDelete5, "onRequestDelete5");
__name2(onRequestDelete5, "onRequestDelete");
async function onRequestGet11({ env }) {
  const { results } = await env.DB.prepare("SELECT * FROM countries ORDER BY name").all();
  return json(results);
}
__name(onRequestGet11, "onRequestGet11");
__name2(onRequestGet11, "onRequestGet");
var FLIGHT_FIELDS2 = [
  "airline_id",
  "origin",
  "destination",
  "departure_date",
  "departure_time",
  "arrival_time",
  "duration_minutes",
  "trip_type",
  "stop_type",
  "aircraft_type",
  "price_economy",
  "price_business",
  "services",
  "thumbnail_url"
];
async function onRequestGet12({ request, env }) {
  const url = new URL(request.url);
  if (url.searchParams.get("routePoints") === "1") {
    const { results: results2 } = await env.DB.prepare("SELECT origin, destination FROM flights").all();
    const origins = [...new Set(results2.map((r) => r.origin))].sort();
    const destinations = [...new Set(results2.map((r) => r.destination))].sort();
    return json({ origins, destinations });
  }
  if (url.searchParams.get("admin") === "1") {
    const { results: results2 } = await env.DB.prepare(
      `SELECT f.*, a.name AS airline_name, a.logo_url AS airline_logo
       FROM flights f JOIN airlines a ON a.id = f.airline_id
       ORDER BY f.id`
    ).all();
    return json(results2);
  }
  const { results } = await env.DB.prepare(
    `SELECT f.*, a.name AS airline_name, a.logo_url AS airline_logo
     FROM flights f JOIN airlines a ON a.id = f.airline_id
     ORDER BY f.departure_date, f.departure_time`
  ).all();
  return json(results);
}
__name(onRequestGet12, "onRequestGet12");
__name2(onRequestGet12, "onRequestGet");
async function onRequestPost8(context) {
  const { request, env } = context;
  const user = await getSessionUser(context);
  if (!user || user.role !== "admin") return errorJson("Kh\xF4ng c\xF3 quy\u1EC1n", 403);
  const body = await readJson(request);
  const values = FLIGHT_FIELDS2.map((f) => body[f] ?? null);
  const placeholders = FLIGHT_FIELDS2.map(() => "?").join(", ");
  const result = await env.DB.prepare(
    `INSERT INTO flights (${FLIGHT_FIELDS2.join(", ")}) VALUES (${placeholders})`
  ).bind(...values).run();
  return json({ id: result.meta.last_row_id }, 201);
}
__name(onRequestPost8, "onRequestPost8");
__name2(onRequestPost8, "onRequestPost");
async function onRequestPost9(context) {
  const { request, env } = context;
  const user = await getSessionUser(context);
  if (!user) return errorJson("Vui l\xF2ng \u0111\u0103ng nh\u1EADp tr\u01B0\u1EDBc khi \u0111\u1EB7t ch\u1ED7.", 401);
  const body = await readJson(request);
  const { name, email, phone, total } = body;
  if (!name || !email || !phone || total == null) return errorJson("Thi\u1EBFu d\u1EEF li\u1EC7u \u0111\u01A1n h\xE0ng", 400);
  const result = await env.DB.prepare(
    `INSERT INTO orders (user_id, customer_name, email, phone, total_price, status)
     VALUES (?, ?, ?, ?, ?, 'confirmed')`
  ).bind(user.id, name, email, phone, total).run();
  return json({ id: result.meta.last_row_id }, 201);
}
__name(onRequestPost9, "onRequestPost9");
__name2(onRequestPost9, "onRequestPost");
async function onRequestGet13(context) {
  const { request, env } = context;
  const user = await getSessionUser(context);
  if (!user) return errorJson("Ch\u01B0a \u0111\u0103ng nh\u1EADp", 401);
  const targetId = new URL(request.url).searchParams.get("userId") || user.id;
  if (Number(targetId) !== user.id && user.role !== "admin") return errorJson("Kh\xF4ng c\xF3 quy\u1EC1n", 403);
  const row = await env.DB.prepare(
    "SELECT id, username, email, full_name, phone, role FROM users WHERE id = ?"
  ).bind(targetId).first();
  return json(row || null);
}
__name(onRequestGet13, "onRequestGet13");
__name2(onRequestGet13, "onRequestGet");
async function onRequestPut3(context) {
  const { request, env } = context;
  const user = await getSessionUser(context);
  if (!user) return errorJson("Ch\u01B0a \u0111\u0103ng nh\u1EADp", 401);
  const body = await readJson(request);
  const targetId = body.userId || user.id;
  if (Number(targetId) !== user.id && user.role !== "admin") return errorJson("Kh\xF4ng c\xF3 quy\u1EC1n", 403);
  await env.DB.prepare("UPDATE users SET full_name = ?, phone = ? WHERE id = ?").bind(body.fullName ?? null, body.phone ?? null, targetId).run();
  return json({ ok: true });
}
__name(onRequestPut3, "onRequestPut3");
__name2(onRequestPut3, "onRequestPut");
var TOUR_FIELDS2 = [
  "name",
  "operator",
  "thumbnail_url",
  "days",
  "nights",
  "price",
  "origin",
  "destination",
  "departure_date",
  "departure_time",
  "duration_minutes",
  "airline_id",
  "aircraft_type",
  "country_id",
  "services",
  "featured"
];
async function onRequestGet14({ request, env }) {
  const url = new URL(request.url);
  if (url.searchParams.get("featured") === "1") {
    const limit = Number(url.searchParams.get("limit") || 8);
    const { results: results2 } = await env.DB.prepare(
      "SELECT * FROM tours WHERE featured = 1 ORDER BY id LIMIT ?"
    ).bind(limit).all();
    return json(results2);
  }
  if (url.searchParams.get("admin") === "1") {
    const { results: results2 } = await env.DB.prepare("SELECT * FROM tours ORDER BY id").all();
    return json(results2);
  }
  const { results } = await env.DB.prepare(
    `SELECT t.*, a.name AS airline_name, a.logo_url AS airline_logo
     FROM tours t JOIN airlines a ON a.id = t.airline_id
     ORDER BY t.departure_date`
  ).all();
  return json(results);
}
__name(onRequestGet14, "onRequestGet14");
__name2(onRequestGet14, "onRequestGet");
async function onRequestPost10(context) {
  const { request, env } = context;
  const user = await getSessionUser(context);
  if (!user || user.role !== "admin") return errorJson("Kh\xF4ng c\xF3 quy\u1EC1n", 403);
  const body = await readJson(request);
  const values = TOUR_FIELDS2.map((f) => toBindValue(body[f]));
  const placeholders = TOUR_FIELDS2.map(() => "?").join(", ");
  const result = await env.DB.prepare(
    `INSERT INTO tours (${TOUR_FIELDS2.join(", ")}) VALUES (${placeholders})`
  ).bind(...values).run();
  return json({ id: result.meta.last_row_id }, 201);
}
__name(onRequestPost10, "onRequestPost10");
__name2(onRequestPost10, "onRequestPost");
var FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast";
var REQUEST_TIMEOUT_MS = 6e3;
function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}
__name(jsonResponse, "jsonResponse");
__name2(jsonResponse, "jsonResponse");
async function fetchWithTimeout(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}
__name(fetchWithTimeout, "fetchWithTimeout");
__name2(fetchWithTimeout, "fetchWithTimeout");
function pickDailyEntries(list) {
  const byDate = /* @__PURE__ */ new Map();
  for (const item of list) {
    const date = item.dt_txt.slice(0, 10);
    const hour = Number(item.dt_txt.slice(11, 13));
    const existing = byDate.get(date);
    if (!existing || Math.abs(hour - 12) < Math.abs(existing.hour - 12)) {
      byDate.set(date, { hour, item });
    }
  }
  return Array.from(byDate.values()).slice(0, 5).map(({ item }) => ({
    date: item.dt_txt.slice(0, 10),
    temp: Math.round(item.main.temp),
    description: item.weather[0]?.description || "",
    icon: item.weather[0]?.icon || "01d"
  }));
}
__name(pickDailyEntries, "pickDailyEntries");
__name2(pickDailyEntries, "pickDailyEntries");
async function onRequestGet15(context) {
  const { request, env } = context;
  const city = new URL(request.url).searchParams.get("city")?.trim();
  if (!city) {
    return jsonResponse({ error: "Thi\u1EBFu tham s\u1ED1 city" }, 400);
  }
  const apiKey = env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    return jsonResponse({ error: "Server ch\u01B0a c\u1EA5u h\xECnh API key" }, 500);
  }
  const url = `${FORECAST_URL}?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&lang=vi`;
  let res;
  try {
    res = await fetchWithTimeout(url);
  } catch (err) {
    if (err.name === "AbortError") {
      return jsonResponse({ error: "M\xE1y ch\u1EE7 th\u1EDDi ti\u1EBFt ph\u1EA3n h\u1ED3i qu\xE1 ch\u1EADm" }, 504);
    }
    return jsonResponse({ error: "Kh\xF4ng th\u1EC3 k\u1EBFt n\u1ED1i t\u1EDBi m\xE1y ch\u1EE7 th\u1EDDi ti\u1EBFt" }, 502);
  }
  if (res.status === 404) {
    return jsonResponse({ error: `Kh\xF4ng t\xECm th\u1EA5y th\xE0nh ph\u1ED1 "${city}"` }, 404);
  }
  if (!res.ok) {
    return jsonResponse({ error: "Kh\xF4ng th\u1EC3 l\u1EA5y d\u1EEF li\u1EC7u th\u1EDDi ti\u1EBFt" }, 502);
  }
  const data = await res.json();
  const days = pickDailyEntries(data.list || []);
  return jsonResponse({ city: data.city?.name || city, days });
}
__name(onRequestGet15, "onRequestGet15");
__name2(onRequestGet15, "onRequestGet");
var routes = [
  {
    routePath: "/api/orders/:id/items",
    mountPath: "/api/orders/:id",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost]
  },
  {
    routePath: "/api/tours/:id/itinerary",
    mountPath: "/api/tours/:id",
    method: "DELETE",
    middlewares: [],
    modules: [onRequestDelete]
  },
  {
    routePath: "/api/tours/:id/itinerary",
    mountPath: "/api/tours/:id",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet]
  },
  {
    routePath: "/api/tours/:id/itinerary",
    mountPath: "/api/tours/:id",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost2]
  },
  {
    routePath: "/api/admin/booking-by-airline",
    mountPath: "/api/admin",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet2]
  },
  {
    routePath: "/api/admin/booking-by-country",
    mountPath: "/api/admin",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet3]
  },
  {
    routePath: "/api/admin/stats",
    mountPath: "/api/admin",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet4]
  },
  {
    routePath: "/api/auth/forgot-password",
    mountPath: "/api/auth",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost3]
  },
  {
    routePath: "/api/auth/login",
    mountPath: "/api/auth",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost4]
  },
  {
    routePath: "/api/auth/logout",
    mountPath: "/api/auth",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost5]
  },
  {
    routePath: "/api/auth/register",
    mountPath: "/api/auth",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost6]
  },
  {
    routePath: "/api/auth/session",
    mountPath: "/api/auth",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet5]
  },
  {
    routePath: "/api/cart/count",
    mountPath: "/api/cart",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet6]
  },
  {
    routePath: "/api/cart/:id",
    mountPath: "/api/cart",
    method: "DELETE",
    middlewares: [],
    modules: [onRequestDelete2]
  },
  {
    routePath: "/api/flights/:id",
    mountPath: "/api/flights",
    method: "DELETE",
    middlewares: [],
    modules: [onRequestDelete3]
  },
  {
    routePath: "/api/flights/:id",
    mountPath: "/api/flights",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet7]
  },
  {
    routePath: "/api/flights/:id",
    mountPath: "/api/flights",
    method: "PUT",
    middlewares: [],
    modules: [onRequestPut]
  },
  {
    routePath: "/api/tours/:id",
    mountPath: "/api/tours",
    method: "DELETE",
    middlewares: [],
    modules: [onRequestDelete4]
  },
  {
    routePath: "/api/tours/:id",
    mountPath: "/api/tours",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet8]
  },
  {
    routePath: "/api/tours/:id",
    mountPath: "/api/tours",
    method: "PUT",
    middlewares: [],
    modules: [onRequestPut2]
  },
  {
    routePath: "/api/airlines",
    mountPath: "/api",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet9]
  },
  {
    routePath: "/api/cart",
    mountPath: "/api/cart",
    method: "DELETE",
    middlewares: [],
    modules: [onRequestDelete5]
  },
  {
    routePath: "/api/cart",
    mountPath: "/api/cart",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet10]
  },
  {
    routePath: "/api/cart",
    mountPath: "/api/cart",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost7]
  },
  {
    routePath: "/api/countries",
    mountPath: "/api",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet11]
  },
  {
    routePath: "/api/flights",
    mountPath: "/api/flights",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet12]
  },
  {
    routePath: "/api/flights",
    mountPath: "/api/flights",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost8]
  },
  {
    routePath: "/api/orders",
    mountPath: "/api/orders",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost9]
  },
  {
    routePath: "/api/profile",
    mountPath: "/api",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet13]
  },
  {
    routePath: "/api/profile",
    mountPath: "/api",
    method: "PUT",
    middlewares: [],
    modules: [onRequestPut3]
  },
  {
    routePath: "/api/tours",
    mountPath: "/api/tours",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet14]
  },
  {
    routePath: "/api/tours",
    mountPath: "/api/tours",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost10]
  },
  {
    routePath: "/api/weather-forecast",
    mountPath: "/api",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet15]
  }
];
function lexer(str) {
  var tokens = [];
  var i = 0;
  while (i < str.length) {
    var char = str[i];
    if (char === "*" || char === "+" || char === "?") {
      tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
      continue;
    }
    if (char === "\\") {
      tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
      continue;
    }
    if (char === "{") {
      tokens.push({ type: "OPEN", index: i, value: str[i++] });
      continue;
    }
    if (char === "}") {
      tokens.push({ type: "CLOSE", index: i, value: str[i++] });
      continue;
    }
    if (char === ":") {
      var name = "";
      var j = i + 1;
      while (j < str.length) {
        var code = str.charCodeAt(j);
        if (
          // `0-9`
          code >= 48 && code <= 57 || // `A-Z`
          code >= 65 && code <= 90 || // `a-z`
          code >= 97 && code <= 122 || // `_`
          code === 95
        ) {
          name += str[j++];
          continue;
        }
        break;
      }
      if (!name)
        throw new TypeError("Missing parameter name at ".concat(i));
      tokens.push({ type: "NAME", index: i, value: name });
      i = j;
      continue;
    }
    if (char === "(") {
      var count = 1;
      var pattern = "";
      var j = i + 1;
      if (str[j] === "?") {
        throw new TypeError('Pattern cannot start with "?" at '.concat(j));
      }
      while (j < str.length) {
        if (str[j] === "\\") {
          pattern += str[j++] + str[j++];
          continue;
        }
        if (str[j] === ")") {
          count--;
          if (count === 0) {
            j++;
            break;
          }
        } else if (str[j] === "(") {
          count++;
          if (str[j + 1] !== "?") {
            throw new TypeError("Capturing groups are not allowed at ".concat(j));
          }
        }
        pattern += str[j++];
      }
      if (count)
        throw new TypeError("Unbalanced pattern at ".concat(i));
      if (!pattern)
        throw new TypeError("Missing pattern at ".concat(i));
      tokens.push({ type: "PATTERN", index: i, value: pattern });
      i = j;
      continue;
    }
    tokens.push({ type: "CHAR", index: i, value: str[i++] });
  }
  tokens.push({ type: "END", index: i, value: "" });
  return tokens;
}
__name(lexer, "lexer");
__name2(lexer, "lexer");
function parse(str, options) {
  if (options === void 0) {
    options = {};
  }
  var tokens = lexer(str);
  var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a, _b = options.delimiter, delimiter = _b === void 0 ? "/#?" : _b;
  var result = [];
  var key = 0;
  var i = 0;
  var path = "";
  var tryConsume = /* @__PURE__ */ __name2(function(type) {
    if (i < tokens.length && tokens[i].type === type)
      return tokens[i++].value;
  }, "tryConsume");
  var mustConsume = /* @__PURE__ */ __name2(function(type) {
    var value2 = tryConsume(type);
    if (value2 !== void 0)
      return value2;
    var _a2 = tokens[i], nextType = _a2.type, index = _a2.index;
    throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
  }, "mustConsume");
  var consumeText = /* @__PURE__ */ __name2(function() {
    var result2 = "";
    var value2;
    while (value2 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
      result2 += value2;
    }
    return result2;
  }, "consumeText");
  var isSafe = /* @__PURE__ */ __name2(function(value2) {
    for (var _i = 0, delimiter_1 = delimiter; _i < delimiter_1.length; _i++) {
      var char2 = delimiter_1[_i];
      if (value2.indexOf(char2) > -1)
        return true;
    }
    return false;
  }, "isSafe");
  var safePattern = /* @__PURE__ */ __name2(function(prefix2) {
    var prev = result[result.length - 1];
    var prevText = prefix2 || (prev && typeof prev === "string" ? prev : "");
    if (prev && !prevText) {
      throw new TypeError('Must have text between two parameters, missing text after "'.concat(prev.name, '"'));
    }
    if (!prevText || isSafe(prevText))
      return "[^".concat(escapeString(delimiter), "]+?");
    return "(?:(?!".concat(escapeString(prevText), ")[^").concat(escapeString(delimiter), "])+?");
  }, "safePattern");
  while (i < tokens.length) {
    var char = tryConsume("CHAR");
    var name = tryConsume("NAME");
    var pattern = tryConsume("PATTERN");
    if (name || pattern) {
      var prefix = char || "";
      if (prefixes.indexOf(prefix) === -1) {
        path += prefix;
        prefix = "";
      }
      if (path) {
        result.push(path);
        path = "";
      }
      result.push({
        name: name || key++,
        prefix,
        suffix: "",
        pattern: pattern || safePattern(prefix),
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    var value = char || tryConsume("ESCAPED_CHAR");
    if (value) {
      path += value;
      continue;
    }
    if (path) {
      result.push(path);
      path = "";
    }
    var open = tryConsume("OPEN");
    if (open) {
      var prefix = consumeText();
      var name_1 = tryConsume("NAME") || "";
      var pattern_1 = tryConsume("PATTERN") || "";
      var suffix = consumeText();
      mustConsume("CLOSE");
      result.push({
        name: name_1 || (pattern_1 ? key++ : ""),
        pattern: name_1 && !pattern_1 ? safePattern(prefix) : pattern_1,
        prefix,
        suffix,
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    mustConsume("END");
  }
  return result;
}
__name(parse, "parse");
__name2(parse, "parse");
function match(str, options) {
  var keys = [];
  var re = pathToRegexp(str, keys, options);
  return regexpToFunction(re, keys, options);
}
__name(match, "match");
__name2(match, "match");
function regexpToFunction(re, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.decode, decode = _a === void 0 ? function(x) {
    return x;
  } : _a;
  return function(pathname) {
    var m = re.exec(pathname);
    if (!m)
      return false;
    var path = m[0], index = m.index;
    var params = /* @__PURE__ */ Object.create(null);
    var _loop_1 = /* @__PURE__ */ __name2(function(i2) {
      if (m[i2] === void 0)
        return "continue";
      var key = keys[i2 - 1];
      if (key.modifier === "*" || key.modifier === "+") {
        params[key.name] = m[i2].split(key.prefix + key.suffix).map(function(value) {
          return decode(value, key);
        });
      } else {
        params[key.name] = decode(m[i2], key);
      }
    }, "_loop_1");
    for (var i = 1; i < m.length; i++) {
      _loop_1(i);
    }
    return { path, index, params };
  };
}
__name(regexpToFunction, "regexpToFunction");
__name2(regexpToFunction, "regexpToFunction");
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
__name(escapeString, "escapeString");
__name2(escapeString, "escapeString");
function flags(options) {
  return options && options.sensitive ? "" : "i";
}
__name(flags, "flags");
__name2(flags, "flags");
function regexpToRegexp(path, keys) {
  if (!keys)
    return path;
  var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
  var index = 0;
  var execResult = groupsRegex.exec(path.source);
  while (execResult) {
    keys.push({
      // Use parenthesized substring match if available, index otherwise
      name: execResult[1] || index++,
      prefix: "",
      suffix: "",
      modifier: "",
      pattern: ""
    });
    execResult = groupsRegex.exec(path.source);
  }
  return path;
}
__name(regexpToRegexp, "regexpToRegexp");
__name2(regexpToRegexp, "regexpToRegexp");
function arrayToRegexp(paths, keys, options) {
  var parts = paths.map(function(path) {
    return pathToRegexp(path, keys, options).source;
  });
  return new RegExp("(?:".concat(parts.join("|"), ")"), flags(options));
}
__name(arrayToRegexp, "arrayToRegexp");
__name2(arrayToRegexp, "arrayToRegexp");
function stringToRegexp(path, keys, options) {
  return tokensToRegexp(parse(path, options), keys, options);
}
__name(stringToRegexp, "stringToRegexp");
__name2(stringToRegexp, "stringToRegexp");
function tokensToRegexp(tokens, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function(x) {
    return x;
  } : _d, _e = options.delimiter, delimiter = _e === void 0 ? "/#?" : _e, _f = options.endsWith, endsWith = _f === void 0 ? "" : _f;
  var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
  var delimiterRe = "[".concat(escapeString(delimiter), "]");
  var route = start ? "^" : "";
  for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
    var token = tokens_1[_i];
    if (typeof token === "string") {
      route += escapeString(encode(token));
    } else {
      var prefix = escapeString(encode(token.prefix));
      var suffix = escapeString(encode(token.suffix));
      if (token.pattern) {
        if (keys)
          keys.push(token);
        if (prefix || suffix) {
          if (token.modifier === "+" || token.modifier === "*") {
            var mod = token.modifier === "*" ? "?" : "";
            route += "(?:".concat(prefix, "((?:").concat(token.pattern, ")(?:").concat(suffix).concat(prefix, "(?:").concat(token.pattern, "))*)").concat(suffix, ")").concat(mod);
          } else {
            route += "(?:".concat(prefix, "(").concat(token.pattern, ")").concat(suffix, ")").concat(token.modifier);
          }
        } else {
          if (token.modifier === "+" || token.modifier === "*") {
            throw new TypeError('Can not repeat "'.concat(token.name, '" without a prefix and suffix'));
          }
          route += "(".concat(token.pattern, ")").concat(token.modifier);
        }
      } else {
        route += "(?:".concat(prefix).concat(suffix, ")").concat(token.modifier);
      }
    }
  }
  if (end) {
    if (!strict)
      route += "".concat(delimiterRe, "?");
    route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
  } else {
    var endToken = tokens[tokens.length - 1];
    var isEndDelimited = typeof endToken === "string" ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1 : endToken === void 0;
    if (!strict) {
      route += "(?:".concat(delimiterRe, "(?=").concat(endsWithRe, "))?");
    }
    if (!isEndDelimited) {
      route += "(?=".concat(delimiterRe, "|").concat(endsWithRe, ")");
    }
  }
  return new RegExp(route, flags(options));
}
__name(tokensToRegexp, "tokensToRegexp");
__name2(tokensToRegexp, "tokensToRegexp");
function pathToRegexp(path, keys, options) {
  if (path instanceof RegExp)
    return regexpToRegexp(path, keys);
  if (Array.isArray(path))
    return arrayToRegexp(path, keys, options);
  return stringToRegexp(path, keys, options);
}
__name(pathToRegexp, "pathToRegexp");
__name2(pathToRegexp, "pathToRegexp");
var escapeRegex = /[.+?^${}()|[\]\\]/g;
function* executeRequest(request) {
  const requestPath = new URL(request.url).pathname;
  for (const route of [...routes].reverse()) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult) {
      for (const handler of route.middlewares.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: mountMatchResult.path
        };
      }
    }
  }
  for (const route of routes) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: true
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult && route.modules.length) {
      for (const handler of route.modules.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: matchResult.path
        };
      }
      break;
    }
  }
}
__name(executeRequest, "executeRequest");
__name2(executeRequest, "executeRequest");
var pages_template_worker_default = {
  async fetch(originalRequest, env, workerContext) {
    let request = originalRequest;
    const handlerIterator = executeRequest(request);
    let data = {};
    let isFailOpen = false;
    const next = /* @__PURE__ */ __name2(async (input, init) => {
      if (input !== void 0) {
        let url = input;
        if (typeof input === "string") {
          url = new URL(input, request.url).toString();
        }
        request = new Request(url, init);
      }
      const result = handlerIterator.next();
      if (result.done === false) {
        const { handler, params, path } = result.value;
        const context = {
          request: new Request(request.clone()),
          functionPath: path,
          next,
          params,
          get data() {
            return data;
          },
          set data(value) {
            if (typeof value !== "object" || value === null) {
              throw new Error("context.data must be an object");
            }
            data = value;
          },
          env,
          waitUntil: workerContext.waitUntil.bind(workerContext),
          passThroughOnException: /* @__PURE__ */ __name2(() => {
            isFailOpen = true;
          }, "passThroughOnException")
        };
        const response = await handler(context);
        if (!(response instanceof Response)) {
          throw new Error("Your Pages function should return a Response");
        }
        return cloneResponse(response);
      } else if ("ASSETS") {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      } else {
        const response = await fetch(request);
        return cloneResponse(response);
      }
    }, "next");
    try {
      return await next();
    } catch (error) {
      if (isFailOpen) {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      }
      throw error;
    }
  }
};
var cloneResponse = /* @__PURE__ */ __name2((response) => (
  // https://fetch.spec.whatwg.org/#null-body-status
  new Response(
    [101, 204, 205, 304].includes(response.status) ? null : response.body,
    response
  )
), "cloneResponse");
var drainBody = /* @__PURE__ */ __name2(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
__name2(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name2(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    const body = JSON.stringify(error);
    const headers = {
      "Content-Type": "application/json",
      "MF-Experimental-Error-Stack": "true"
    };
    const encoded = encodeURIComponent(body);
    if (encoded.length <= 8192) {
      headers["MF-Experimental-Error-Stack-Payload"] = encoded;
    }
    return new Response(body, { status: 500, headers });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = pages_template_worker_default;
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
__name2(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
__name2(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");
__name2(__facade_invoke__, "__facade_invoke__");
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  static {
    __name(this, "___Facade_ScheduledController__");
  }
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  scheduledTime;
  cron;
  static {
    __name2(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name2(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name2(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
__name2(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name2((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name2((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
__name2(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;

// C:/Users/PHƯỚC/AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody2 = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default2 = drainBody2;

// C:/Users/PHƯỚC/AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError2(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError2(e.cause)
  };
}
__name(reduceError2, "reduceError");
var jsonError2 = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError2(e);
    const body = JSON.stringify(error);
    const headers = {
      "Content-Type": "application/json",
      "MF-Experimental-Error-Stack": "true"
    };
    const encoded = encodeURIComponent(body);
    if (encoded.length <= 8192) {
      headers["MF-Experimental-Error-Stack-Payload"] = encoded;
    }
    return new Response(body, { status: 500, headers });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default2 = jsonError2;

// .wrangler/tmp/bundle-Wcu2AF/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__2 = [
  middleware_ensure_req_body_drained_default2,
  middleware_miniflare3_json_error_default2
];
var middleware_insertion_facade_default2 = middleware_loader_entry_default;

// C:/Users/PHƯỚC/AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__2 = [];
function __facade_register__2(...args) {
  __facade_middleware__2.push(...args.flat());
}
__name(__facade_register__2, "__facade_register__");
function __facade_invokeChain__2(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__2(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__2, "__facade_invokeChain__");
function __facade_invoke__2(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__2(request, env, ctx, dispatch, [
    ...__facade_middleware__2,
    finalMiddleware
  ]);
}
__name(__facade_invoke__2, "__facade_invoke__");

// .wrangler/tmp/bundle-Wcu2AF/middleware-loader.entry.ts
var __Facade_ScheduledController__2 = class ___Facade_ScheduledController__2 {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  scheduledTime;
  cron;
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__2)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler2(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__2 === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__2.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__2) {
    __facade_register__2(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__2(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__2(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler2, "wrapExportedHandler");
function wrapWorkerEntrypoint2(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__2 === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__2.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__2) {
    __facade_register__2(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__2(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__2(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint2, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY2;
if (typeof middleware_insertion_facade_default2 === "object") {
  WRAPPED_ENTRY2 = wrapExportedHandler2(middleware_insertion_facade_default2);
} else if (typeof middleware_insertion_facade_default2 === "function") {
  WRAPPED_ENTRY2 = wrapWorkerEntrypoint2(middleware_insertion_facade_default2);
}
var middleware_loader_entry_default2 = WRAPPED_ENTRY2;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__2 as __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default2 as default
};
//# sourceMappingURL=functionsWorker-0.5390316159523036.js.map
