# DATABASE.md — Schema Cloudflare D1 (SQLite) (TravelViet)

Cơ sở dữ liệu chạy trên **Cloudflare D1** (SQLite serverless, hosted), truy vấn qua Pages Functions (`functions/api/**`). Xem lý do và cách các Function gọi D1 trong [ARCHITECTURE.md](ARCHITECTURE.md). Định nghĩa đầy đủ nằm trong [d1/schema.sql](d1/schema.sql); dữ liệu mẫu trong [d1/seed.sql](d1/seed.sql).

## 1. Sơ đồ quan hệ (tổng quan)

```
users ───< sessions
  │
  └──< orders ───< order_items >─── flights
                                 \
  ┌──< cart_items >─── flights/tours  └── tours ───< tour_itinerary
  │                                           tours >─── airlines
  │                                           flights >─── airlines
  │                                           tours >─── countries
```

## 2. Bảng `users`

| Cột | Kiểu | Ghi chú |
|---|---|---|
| id | INTEGER PK AUTOINCREMENT | |
| username | TEXT UNIQUE NOT NULL | 5–15 ký tự, chỉ chữ/số |
| email | TEXT UNIQUE NOT NULL | dùng để đăng nhập |
| password_hash | TEXT NOT NULL | PBKDF2 (100.000 vòng, SHA-256), format `pbkdf2$iterations$salt$hash` |
| full_name | TEXT | |
| phone | TEXT | |
| role | TEXT NOT NULL DEFAULT 'user' | `admin` \| `user` |
| created_at | TEXT NOT NULL DEFAULT (datetime('now')) | |

## 3. Bảng `sessions`

| Cột | Kiểu | Ghi chú |
|---|---|---|
| token | TEXT PK | token ngẫu nhiên, gửi cho client qua cookie `httpOnly` `tv_session` |
| user_id | INTEGER NOT NULL FK → users.id ON DELETE CASCADE | |
| created_at | TEXT NOT NULL DEFAULT (datetime('now')) | |
| expires_at | TEXT NOT NULL | 30 ngày kể từ lúc đăng nhập |

## 4. Bảng `airlines`

| Cột | Kiểu | Ghi chú |
|---|---|---|
| id | INTEGER PK AUTOINCREMENT | |
| name | TEXT NOT NULL | VD: VietJet Air |
| code | TEXT NOT NULL | VD: VJ |
| logo_url | TEXT NOT NULL | |

## 5. Bảng `flights`

| Cột | Kiểu | Ghi chú |
|---|---|---|
| id | INTEGER PK AUTOINCREMENT | |
| airline_id | INTEGER NOT NULL FK → airlines.id | |
| origin | TEXT NOT NULL | mã/tên điểm đi |
| destination | TEXT NOT NULL | mã/tên điểm đến |
| departure_date | TEXT NOT NULL | ISO date |
| departure_time | TEXT NOT NULL | HH:mm |
| arrival_time | TEXT NOT NULL | HH:mm |
| duration_minutes | INTEGER NOT NULL | |
| trip_type | TEXT NOT NULL | `oneway` \| `roundtrip` |
| stop_type | TEXT NOT NULL | `direct` \| `multi_city` |
| aircraft_type | TEXT NOT NULL | VD: Boeing 787, Airbus A321 |
| price_economy | INTEGER NOT NULL | VND |
| price_business | INTEGER NOT NULL | VND |
| services | TEXT | mô tả dịch vụ kèm theo, phân tách bởi dấu phẩy |
| thumbnail_url | TEXT | ảnh minh hoạ (không bắt buộc) |

## 6. Bảng `tours`

| Cột | Kiểu | Ghi chú |
|---|---|---|
| id | INTEGER PK AUTOINCREMENT | |
| name | TEXT NOT NULL | tên tour |
| operator | TEXT NOT NULL | hãng du lịch |
| thumbnail_url | TEXT NOT NULL | ảnh 600x400 |
| days | INTEGER NOT NULL | số ngày |
| nights | INTEGER NOT NULL | số đêm |
| price | INTEGER NOT NULL | VND |
| origin | TEXT NOT NULL | điểm đi |
| destination | TEXT NOT NULL | điểm đến |
| departure_date | TEXT NOT NULL | ISO date |
| departure_time | TEXT NOT NULL | HH:mm |
| duration_minutes | INTEGER NOT NULL | thời gian bay đến điểm đến |
| airline_id | INTEGER NOT NULL FK → airlines.id | hãng bay đi kèm tour |
| aircraft_type | TEXT NOT NULL | |
| country_id | INTEGER NOT NULL FK → countries.id | quốc gia điểm đến, phục vụ thống kê Dashboard |
| services | TEXT | dịch vụ đi kèm |
| featured | INTEGER NOT NULL DEFAULT 0 | 1 = hiển thị trong "8 tour nổi bật" ở trang chủ |

## 7. Bảng `tour_itinerary`

| Cột | Kiểu | Ghi chú |
|---|---|---|
| id | INTEGER PK AUTOINCREMENT | |
| tour_id | INTEGER NOT NULL FK → tours.id ON DELETE CASCADE | |
| day_number | INTEGER NOT NULL | Ngày 1, Ngày 2... |
| title | TEXT NOT NULL | VD: "Đà Nẵng - Bà Nà Hills" |
| description | TEXT NOT NULL | chi tiết lịch trình ngày đó |

Khi tạo/sửa tour ở Admin, lịch trình được sinh tự động bằng `genItinerary()` (`assets/js/db/database.js`) rồi gửi lên `POST/DELETE /api/tours/:id/itinerary`.

## 8. Bảng `countries`

| Cột | Kiểu | Ghi chú |
|---|---|---|
| id | INTEGER PK AUTOINCREMENT | |
| name | TEXT NOT NULL UNIQUE | VD: Việt Nam, Singapore, Thái Lan |

## 9. Bảng `cart_items`

| Cột | Kiểu | Ghi chú |
|---|---|---|
| id | INTEGER PK AUTOINCREMENT | |
| session_id | TEXT NOT NULL | UUID sinh phía client (`localStorage`), dùng chung cho khách vãng lai lẫn user đã đăng nhập |
| item_type | TEXT NOT NULL | `flight` \| `tour` |
| item_id | INTEGER NOT NULL | FK động → flights.id hoặc tours.id tuỳ item_type |
| fare_class | TEXT | `economy` \| `business` (chỉ áp dụng cho flight) |
| price | INTEGER NOT NULL | giá tại thời điểm thêm vào giỏ |
| added_at | TEXT NOT NULL DEFAULT (datetime('now')) | |

## 10. Bảng `orders`

| Cột | Kiểu | Ghi chú |
|---|---|---|
| id | INTEGER PK AUTOINCREMENT | |
| user_id | INTEGER FK → users.id | lấy từ session phía server, không tin giá trị client gửi lên |
| customer_name | TEXT NOT NULL | |
| email | TEXT NOT NULL | dùng để mô phỏng gửi email xác nhận |
| phone | TEXT NOT NULL | |
| total_price | INTEGER NOT NULL | |
| status | TEXT NOT NULL DEFAULT 'confirmed' | |
| created_at | TEXT NOT NULL DEFAULT (datetime('now')) | |

## 11. Bảng `order_items`

| Cột | Kiểu | Ghi chú |
|---|---|---|
| id | INTEGER PK AUTOINCREMENT | |
| order_id | INTEGER NOT NULL FK → orders.id ON DELETE CASCADE | |
| item_type | TEXT NOT NULL | `flight` \| `tour` |
| item_id | INTEGER NOT NULL | |
| fare_class | TEXT | |
| price | INTEGER NOT NULL | |

## 12. Ghi chú cho Dashboard (SQL chạy trong `functions/api/admin/*`)

- **Số tour trong tháng:** `COUNT(*) FROM tours WHERE strftime('%Y-%m', departure_date) = strftime('%Y-%m','now')`
- **Số chuyến bay:** `COUNT(*) FROM flights`
- **Số khách đặt tour / đặt chuyến bay:** đếm `order_items` theo `item_type`, join `orders`.
- **Top 10 hãng bay được đặt nhiều nhất:** join `order_items` (item_type='flight') → `flights` → `airlines`, GROUP BY airline, COUNT, ORDER BY DESC LIMIT 10.
- **Tỷ lệ quốc gia có khách đặt tour (pie):** join `order_items` (item_type='tour') → `tours` → `countries`, GROUP BY country.
- **Top 10 nước theo tour/khách:** cùng join trên, thêm `COUNT(DISTINCT tours.id)` làm "số tour" và `COUNT(order_items.id)` làm "số khách đặt vé".

## 13. Seed dữ liệu & thao tác D1

Dữ liệu khởi tạo (10 hãng bay, 10 quốc gia, 16 tour, 26 chuyến bay, lịch trình tự sinh) nằm trong [d1/seed.sql](d1/seed.sql); mô tả nội dung cụ thể xem thêm [SEED_DATA.md](SEED_DATA.md).

```bash
# Áp dụng schema + seed lên D1 local (dev)
wrangler d1 execute travelphuoc-db --local --file=d1/schema.sql
wrangler d1 execute travelphuoc-db --local --file=d1/seed.sql

# Áp dụng lên D1 production
wrangler d1 execute travelphuoc-db --remote --file=d1/schema.sql
wrangler d1 execute travelphuoc-db --remote --file=d1/seed.sql
```

Tài khoản demo (admin/user) không được seed sẵn bằng SQL vì cần mật khẩu đã hash đúng định dạng PBKDF2 của hệ thống — tạo qua `register.html` rồi nâng quyền admin bằng:

```sql
UPDATE users SET role = 'admin' WHERE email = 'admin@travel.com';
```
