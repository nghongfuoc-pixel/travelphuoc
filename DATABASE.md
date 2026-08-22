# DATABASE.md — Schema SQLite (TravelViet)

Cơ sở dữ liệu chạy trong trình duyệt qua sql.js. Xem lý do trong [ARCHITECTURE.md](ARCHITECTURE.md).

## 1. Sơ đồ quan hệ (tổng quan)

```
users ───< orders ───< order_items >─── flights
  │                                  \
  └──< cart_items >─── flights/tours  └── tours ───< tour_itinerary
                                              tours >─── airlines
                                              flights >─── airlines
                                              tours >─── countries
```

## 2. Bảng `users`

| Cột | Kiểu | Ghi chú |
|---|---|---|
| id | INTEGER PK AUTOINCREMENT | |
| username | TEXT UNIQUE NOT NULL | 5–15 ký tự, chỉ chữ/số |
| email | TEXT UNIQUE NOT NULL | |
| password_hash | TEXT NOT NULL | SHA-256 (demo) |
| full_name | TEXT | |
| phone | TEXT | |
| role | TEXT NOT NULL DEFAULT 'user' | `admin` \| `user` |
| created_at | TEXT NOT NULL | ISO datetime |

## 3. Bảng `airlines`

| Cột | Kiểu | Ghi chú |
|---|---|---|
| id | INTEGER PK AUTOINCREMENT | |
| name | TEXT NOT NULL | VD: VietJet Air |
| logo_url | TEXT NOT NULL | đường dẫn `assets/img/airlines/...` |

## 4. Bảng `flights`

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

## 5. Bảng `tours`

| Cột | Kiểu | Ghi chú |
|---|---|---|
| id | INTEGER PK AUTOINCREMENT | |
| name | TEXT NOT NULL | tên tour |
| operator | TEXT NOT NULL | hãng du lịch |
| thumbnail_url | TEXT NOT NULL | ảnh 600x400, `assets/img/tours/...` |
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

## 6. Bảng `tour_itinerary`

| Cột | Kiểu | Ghi chú |
|---|---|---|
| id | INTEGER PK AUTOINCREMENT | |
| tour_id | INTEGER NOT NULL FK → tours.id | |
| day_number | INTEGER NOT NULL | Ngày 1, Ngày 2... |
| title | TEXT NOT NULL | VD: "Đà Nẵng - Bà Nà Hills" |
| description | TEXT NOT NULL | chi tiết lịch trình ngày đó |

## 7. Bảng `countries`

| Cột | Kiểu | Ghi chú |
|---|---|---|
| id | INTEGER PK AUTOINCREMENT | |
| name | TEXT NOT NULL UNIQUE | VD: Việt Nam, Singapore, Thái Lan |

## 8. Bảng `cart_items`

| Cột | Kiểu | Ghi chú |
|---|---|---|
| id | INTEGER PK AUTOINCREMENT | |
| session_id | TEXT NOT NULL | UUID khách chưa đăng nhập, hoặc `user_id` dạng text khi đã đăng nhập |
| item_type | TEXT NOT NULL | `flight` \| `tour` |
| item_id | INTEGER NOT NULL | FK động → flights.id hoặc tours.id tuỳ item_type |
| fare_class | TEXT | `economy` \| `business` (chỉ áp dụng cho flight) |
| price | INTEGER NOT NULL | giá tại thời điểm thêm vào giỏ |
| added_at | TEXT NOT NULL | ISO datetime |

## 9. Bảng `orders`

| Cột | Kiểu | Ghi chú |
|---|---|---|
| id | INTEGER PK AUTOINCREMENT | |
| user_id | INTEGER FK → users.id | NULL nếu khách vãng lai |
| customer_name | TEXT NOT NULL | |
| email | TEXT NOT NULL | dùng để mô phỏng gửi email xác nhận |
| phone | TEXT NOT NULL | |
| total_price | INTEGER NOT NULL | |
| status | TEXT NOT NULL DEFAULT 'confirmed' | |
| created_at | TEXT NOT NULL | ISO datetime |

## 10. Bảng `order_items`

| Cột | Kiểu | Ghi chú |
|---|---|---|
| id | INTEGER PK AUTOINCREMENT | |
| order_id | INTEGER NOT NULL FK → orders.id | |
| item_type | TEXT NOT NULL | `flight` \| `tour` |
| item_id | INTEGER NOT NULL | |
| fare_class | TEXT | |
| price | INTEGER NOT NULL | |

## 11. Ghi chú cho Dashboard (dùng để viết truy vấn SQL)

- **Số tour trong tháng:** `COUNT(*) FROM tours WHERE strftime('%Y-%m', departure_date) = strftime('%Y-%m','now')`
- **Số chuyến bay:** `COUNT(*) FROM flights`
- **Số khách đặt tour / đặt chuyến bay:** đếm `order_items` theo `item_type`, join `orders`.
- **Top 10 hãng bay được đặt nhiều nhất:** join `order_items` (item_type='flight') → `flights` → `airlines`, GROUP BY airline, COUNT, ORDER BY DESC LIMIT 10.
- **Tỷ lệ quốc gia có khách đặt tour (pie):** join `order_items` (item_type='tour') → `tours` → `countries`, GROUP BY country.
- **Top 10 nước theo tour/khách:** cùng join trên, thêm `COUNT(DISTINCT tours.id)` làm "số tour" và `COUNT(order_items.id)` làm "số khách đặt vé".

## 12. Seed dữ liệu

Dữ liệu khởi tạo cụ thể (8 tour, danh sách hãng bay, chuyến bay mẫu, tài khoản demo) xem tại [SEED_DATA.md](SEED_DATA.md).
