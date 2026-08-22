# ARCHITECTURE.md — TravelViet

## 1. Nguyên tắc thiết kế

- Không backend: mọi logic chạy trong trình duyệt.
- "Database: SQLite" được hiện thực bằng **sql.js** (SQLite biên dịch sang WebAssembly, chạy trực tiếp trong JS).
- Multi-page website (mỗi trang là 1 file `.html` riêng) thay vì SPA, vì yêu cầu có nhiều trang rõ rệt (Home, Flights, Tour, Cart, Login, Admin...) và không cần router phức tạp.
- Dữ liệu SQLite được seed sẵn lúc khởi tạo và **persist lại vào trình duyệt** (IndexedDB, fallback localStorage dạng base64) để giữ dữ liệu Admin vừa tạo/sửa qua các lần tải trang.

## 2. Cấu trúc thư mục đề xuất

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
│   │   ├── base.css          # reset, biến màu, typography dùng chung
│   │   ├── components.css    # button, card, filter, form dùng chung
│   │   └── admin.css         # riêng cho layout admin (sidebar...)
│   ├── js/
│   │   ├── db/
│   │   │   ├── sqljs-init.js # nạp sql.js wasm, mở/khởi tạo DB
│   │   │   ├── schema.js     # câu lệnh CREATE TABLE
│   │   │   ├── seed.js       # INSERT dữ liệu mẫu (theo SEED_DATA.md)
│   │   │   └── persistence.js# lưu/khôi phục DB từ IndexedDB
│   │   ├── auth.js           # đăng ký/đăng nhập/quên mật khẩu, session
│   │   ├── cart.js           # thêm/xoá/đọc giỏ hàng
│   │   ├── validators.js     # validate username/password theo PRD
│   │   ├── format.js         # format tiền tệ, ngày giờ
│   │   ├── pages/
│   │   │   ├── home.js
│   │   │   ├── flights.js
│   │   │   ├── flight-detail.js
│   │   │   ├── tours.js
│   │   │   ├── tour-detail.js
│   │   │   ├── cart.js
│   │   │   ├── login.js / register.js / forgot-password.js
│   │   │   └── admin/
│   │   │       ├── dashboard.js
│   │   │       ├── tours.js / tour-form.js
│   │   │       ├── flights.js / flight-form.js
│   │   │       └── profile.js
│   │   └── vendor/
│   │       ├── sql-wasm.js / sql-wasm.wasm   # sql.js
│   │       └── chart.umd.js                  # Chart.js cho Dashboard
│   └── img/
│       ├── tours/            # thumbnail 600x400
│       └── airlines/         # logo hãng bay
└── docs (các file .md hiện có)
```

## 3. Tầng dữ liệu (Data layer)

1. **Khởi tạo:** mỗi trang load `sqljs-init.js` → kiểm tra IndexedDB đã có DB lưu trước đó chưa.
   - Có → nạp lại (import) buffer nhị phân vào sql.js.
   - Chưa có → chạy `schema.js` tạo bảng, chạy `seed.js` insert dữ liệu mẫu, rồi lưu xuống IndexedDB.
2. **Đọc/ghi:** các trang gọi hàm trong `db/*.js` bằng SQL thuần (SELECT/INSERT/UPDATE/DELETE qua sql.js API), không dùng ORM.
3. **Ghi thay đổi:** sau mỗi INSERT/UPDATE/DELETE (đặt vé, admin CRUD), gọi `persistence.js` export DB ra buffer và lưu lại IndexedDB — đảm bảo dữ liệu không mất khi F5.
4. **Vì sao không dùng localStorage thuần cho toàn bộ dữ liệu:** yêu cầu đề bài chỉ định rõ "Database: SQLite" — sql.js là cách duy nhất chạy SQLite thật trong trình duyệt mà không cần server.

## 4. Session / Auth (giả lập)

- Không có JWT/server session thật. Sau khi đăng nhập thành công (kiểm tra `users` table), lưu `{ userId, username, role }` vào `sessionStorage`.
- Mỗi trang cần bảo vệ (Cart checkout, toàn bộ `/admin/*`) kiểm tra `sessionStorage` lúc load; nếu thiếu hoặc sai role → redirect về `login.html`.
- Mật khẩu lưu dạng hash đơn giản (vd. SHA-256 qua Web Crypto API) trong bảng `users` — đủ cho mục đích demo, không phải chuẩn bảo mật production.

## 5. Giỏ hàng (Cart)

- Lưu trong bảng `cart_items` của SQLite, gắn với `session_id` (một UUID sinh ra và lưu tạm ở `sessionStorage` cho khách chưa đăng nhập, hoặc `user_id` khi đã đăng nhập).
- Trang Cart đọc `cart_items` join với `flights`/`tours` để hiển thị.
- Nút "Xoá giỏ hàng" → DELETE toàn bộ `cart_items` theo session hiện tại.
- Khi bấm "Đăng ký" (đặt chỗ) ở Cart: tạo record trong `orders` + `order_items`, xoá `cart_items`, hiển thị modal thông báo hoàn thành + dòng text mô phỏng "Email xác nhận đã gửi từ nvhai061993@gmail.com đến {email khách hàng}" (không gọi API gửi mail thật, chỉ hiển thị UI).

## 6. Dashboard (Admin)

- `dashboard.js` chạy các câu SQL aggregate (COUNT, GROUP BY) trên `orders`, `order_items`, `flights`, `tours`, `countries` để lấy số liệu 4 ô, dữ liệu biểu đồ cột (top 10 hãng bay theo số lượt đặt), biểu đồ tròn (tỷ lệ quốc gia), và bảng top 10 quốc gia.
- Vẽ biểu đồ bằng **Chart.js** (load qua `vendor/chart.umd.js`, không cần CDN nếu muốn hoạt động offline — có thể dùng CDN nếu chấp nhận cần mạng).

## 7. Điều hướng (Navigation)

- Không dùng router SPA; điều hướng bằng thẻ `<a href="...">` và `window.location.href` kèm query string (vd. `flights.html?from=SGN&to=DAD&date=2026-09-01&type=oneway`).
- Chi tiết từng trang/route: xem [ROUTES.md](ROUTES.md).

## 8. Responsive & Style

- CSS thuần (không framework), biến màu định nghĩa bằng CSS custom properties trong `base.css` (nền trắng, tông sáng — xem [UI_SPEC.md](UI_SPEC.md)).
- Layout responsive bằng Flexbox/Grid, breakpoint cơ bản cho mobile (≤768px).
