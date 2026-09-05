# ARCHITECTURE.md — TravelViet

## 1. Nguyên tắc thiết kế

- Frontend tĩnh (multi-page, mỗi trang là 1 file `.html` riêng) deploy trên **Cloudflare Pages**.
- Backend là **Cloudflare Pages Functions** (`functions/api/**`, chạy trên Workers runtime) — mọi truy cập dữ liệu đi qua các endpoint `/api/...`, không còn gọi thẳng database từ trình duyệt.
- "Database: SQLite" được hiện thực bằng **Cloudflare D1** (SQLite serverless, hosted) — dữ liệu dùng chung cho mọi người dùng/thiết bị, không còn nằm riêng trong từng trình duyệt.
- Auth tự viết (không dùng dịch vụ ngoài): mật khẩu hash bằng PBKDF2 (Web Crypto), session lưu trong bảng `sessions` của D1, gắn với trình duyệt qua cookie `httpOnly`.

> Dự án này từng trải qua 2 kiến trúc trước đó: sql.js chạy hoàn toàn trong trình duyệt (persist qua IndexedDB), rồi Supabase (Postgres + Auth + RLS). Cả hai đã được thay bằng Cloudflare D1 + Pages Functions ở trên vì cần dữ liệu dùng chung nhiều người dùng nhưng vẫn giữ chi phí bằng 0 và ở cùng nền tảng hosting (Cloudflare Pages) đang dùng.

## 2. Cấu trúc thư mục

```
/
├── index.html
├── flights.html
├── flight-detail.html
├── tours.html
├── tour-detail.html
├── cart.html
├── login.html
├── register.html
├── forgot-password.html
├── admin/
│   ├── dashboard.html
│   ├── tours.html
│   ├── tour-form.html
│   ├── flights.html
│   ├── flight-form.html
│   └── profile.html
├── assets/
│   ├── css/
│   ├── js/
│   │   ├── db/database.js    # gọi fetch('/api/...'), không còn gọi DB trực tiếp
│   │   ├── auth.js           # gọi /api/auth/*, quản lý session qua cookie
│   │   ├── cart.js, validators.js, format.js, upload.js
│   │   └── pages/**          # 1 file JS / trang, không đổi khi migrate DB
│   └── img/
├── functions/                 # Cloudflare Pages Functions (backend)
│   ├── lib/                   # helper dùng chung: http.js, crypto.js, auth.js
│   └── api/
│       ├── airlines.js, countries.js
│       ├── flights/index.js, flights/[id].js
│       ├── tours/index.js, tours/[id].js, tours/[id]/itinerary.js
│       ├── cart/index.js, cart/count.js, cart/[id].js
│       ├── orders/index.js, orders/[id]/items.js
│       ├── admin/stats.js, admin/booking-by-airline.js, admin/booking-by-country.js
│       ├── auth/register.js, login.js, logout.js, session.js, forgot-password.js
│       ├── profile.js
│       └── weather-forecast.js
├── d1/
│   ├── schema.sql             # CREATE TABLE cho D1
│   └── seed.sql                # dữ liệu mẫu (airlines, countries, tours, flights, itinerary)
├── wrangler.toml               # binding D1 (database "DB") cho Pages project
└── docs (các file .md hiện có)
```

## 3. Tầng dữ liệu (Data layer)

1. **Client → API:** mọi trang gọi các hàm trong `assets/js/db/database.js` (giữ nguyên tên hàm qua các lần đổi kiến trúc DB) — bên trong mỗi hàm gọi `fetch('/api/...')` tới Pages Function tương ứng.
2. **API → D1:** mỗi Pages Function dùng `env.DB.prepare(sql).bind(...).run()/.all()/.first()` để truy vấn D1 bằng SQL thuần (không ORM). Nhiều thao tác ghi liên quan (vd. thêm itinerary nhiều dòng) dùng `env.DB.batch([...])` để đảm bảo atomic.
3. **Phân quyền:** không dùng RLS như Postgres — mỗi Pages Function tự kiểm tra session (`functions/lib/auth.js` → `getSessionUser()`), route ghi dữ liệu catalog/CRUD admin yêu cầu `role === 'admin'`, route đọc công khai không yêu cầu đăng nhập.
4. **Schema & seed:** định nghĩa trong `d1/schema.sql`, dữ liệu mẫu trong `d1/seed.sql`. Áp dụng bằng:
   ```
   wrangler d1 execute travelphuoc-db --remote --file=d1/schema.sql
   wrangler d1 execute travelphuoc-db --remote --file=d1/seed.sql
   ```

## 4. Session / Auth

- Đăng ký (`POST /api/auth/register`): validate username/password/email, hash mật khẩu bằng PBKDF2 (100.000 vòng lặp, salt ngẫu nhiên), lưu vào bảng `users`.
- Đăng nhập (`POST /api/auth/login`): so khớp hash, tạo token ngẫu nhiên lưu vào bảng `sessions` (hết hạn sau 30 ngày), trả về qua cookie `Set-Cookie: tv_session=...; HttpOnly; SameSite=Lax; Secure` (Secure chỉ bật khi request là HTTPS, để vẫn test được ở `http://localhost` lúc dev).
- Mỗi request sau đó tự động gửi kèm cookie (same-origin) — `getSessionUser()` đọc cookie, join `sessions` + `users` để lấy thông tin user còn hiệu lực.
- Đăng xuất (`POST /api/auth/logout`): xoá dòng session khỏi D1 và xoá cookie.
- Quên mật khẩu: mô phỏng — kiểm tra email có tồn tại hay không, **không gửi email thật** (nhất quán với cách trang Cart mô phỏng "email xác nhận đơn hàng").
- Trang cần bảo vệ (`Cart` checkout, toàn bộ `/admin/*`) gọi `requireAuth()` trong `auth.js`, hàm này gọi `GET /api/auth/session`; nếu không có session hợp lệ → redirect về `login.html`.

## 5. Giỏ hàng (Cart)

- Lưu trong bảng `cart_items` của D1, gắn với `session_id` (UUID sinh ra và lưu ở `localStorage` cho khách chưa đăng nhập, hoặc vẫn dùng UUID khách ngay cả khi đã đăng nhập — không đổi so với thiết kế gốc).
- Trang Cart gọi `getCartItemsBySession()` lấy raw cart rows, rồi gọi `getFlightById`/`getTourById` cho từng dòng để ghép chi tiết hiển thị (logic này nằm ở `cart.js`, không đổi khi migrate DB).
- Khi đặt chỗ: `POST /api/orders` (yêu cầu đã đăng nhập — `user_id` lấy từ session, không tin dữ liệu client gửi lên) tạo `orders`, sau đó `POST /api/orders/:id/items` tạo `order_items`, rồi xoá `cart_items` theo session, hiển thị modal xác nhận + dòng text mô phỏng gửi email (không gọi API gửi mail thật).

## 6. Dashboard (Admin)

- `GET /api/admin/stats`, `GET /api/admin/booking-by-airline`, `GET /api/admin/booking-by-country` chạy các câu SQL aggregate (COUNT, GROUP BY, JOIN) trực tiếp trên D1 — cùng logic SQL đã mô tả ở [DATABASE.md](DATABASE.md) mục "Ghi chú cho Dashboard", chỉ khác là chạy trong Pages Function thay vì chạy trong trình duyệt.
- Vẽ biểu đồ bằng **Chart.js** (không đổi).

## 7. Điều hướng (Navigation)

- Không dùng router SPA; điều hướng bằng thẻ `<a href="...">` và `window.location.href` kèm query string. Chi tiết từng trang/route: xem [ROUTES.md](ROUTES.md).

## 8. Responsive & Style

- CSS thuần (không framework), biến màu định nghĩa bằng CSS custom properties trong `base.css`. Layout responsive bằng Flexbox/Grid, breakpoint cơ bản cho mobile (≤768px). (Không đổi so với thiết kế gốc.)

## 9. Dev & Deploy

- Dev local: `wrangler pages dev . --port 8788` (đọc binding D1 từ `wrangler.toml`, dùng bản D1 local riêng, không đụng dữ liệu production).
- Deploy: `npx wrangler pages deploy . --project-name travelphuoc-pages` (hoặc chạy `deploy-pages.bat`).
