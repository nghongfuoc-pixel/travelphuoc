# SEED_DATA.md — Dữ liệu mẫu — TravelViet

Dữ liệu này được insert tự động lúc khởi tạo SQLite lần đầu (`assets/js/db/seed.js`), theo schema ở [DATABASE.md](DATABASE.md).

## 1. Tài khoản (`users`)

| username | email | password | role |
|---|---|---|---|
| admin | admin@travel.com | Admin123! | admin |
| user01 | user@travel.com | User123! | user |

## 2. Hãng hàng không (`airlines`)

| name | logo file gợi ý |
|---|---|
| Vietnam Airlines | assets/img/airlines/vietnam-airlines.png |
| VietJet Air | assets/img/airlines/vietjet.png |
| Bamboo Airways | assets/img/airlines/bamboo.png |
| Vietravel Airlines | assets/img/airlines/vietravel-airlines.png |
| Singapore Airlines | assets/img/airlines/singapore-airlines.png |
| AirAsia | assets/img/airlines/airasia.png |
| Thai Airways | assets/img/airlines/thai-airways.png |
| Korean Air | assets/img/airlines/korean-air.png |
| Japan Airlines | assets/img/airlines/japan-airlines.png |
| Emirates | assets/img/airlines/emirates.png |

## 3. Quốc gia (`countries`) — phục vụ thống kê Dashboard

Việt Nam, Singapore, Thái Lan, Hàn Quốc, Nhật Bản, Malaysia, Indonesia, Campuchia, Trung Quốc, Các Tiểu Vương quốc Ả Rập Thống nhất.

## 4. Tour nổi bật — 8 tour hiển thị trang chủ (`tours`, `featured=1`)

| # | Tên tour | Hãng du lịch | Điểm đến | Ngày/Đêm | Giá (VND) | Hãng bay | Quốc gia |
|---|---|---|---|---|---|---|---|
| 1 | Đà Nẵng - Bà Nà Hills - Hội An | Vietravel | Đà Nẵng | 3N2Đ | 4.990.000 | Vietnam Airlines | Việt Nam |
| 2 | Phú Quốc Đảo Ngọc | Saigontourist | Phú Quốc | 4N3Đ | 6.490.000 | VietJet Air | Việt Nam |
| 3 | Nha Trang Biển Xanh | Vietravel | Nha Trang | 3N2Đ | 3.990.000 | Bamboo Airways | Việt Nam |
| 4 | Đà Lạt Mộng Mơ | TST Tourist | Đà Lạt | 3N2Đ | 3.490.000 | Vietjet Air | Việt Nam |
| 5 | Hạ Long Kỳ Quan | Fiditour | Hạ Long | 2N1Đ | 2.990.000 | Vietnam Airlines | Việt Nam |
| 6 | Sapa Mây Núi | Saigontourist | Sapa | 3N2Đ | 3.790.000 | Vietnam Airlines | Việt Nam |
| 7 | Huế - Cố Đô Di Sản | Vietravel | Huế | 3N2Đ | 3.590.000 | Bamboo Airways | Việt Nam |
| 8 | Singapore Sắc Màu | Vietravel | Singapore | 4N3Đ | 12.990.000 | Singapore Airlines | Singapore |

Ghi chú ảnh thumbnail: đặt file 600x400 tương ứng tại `assets/img/tours/tour-01.jpg` … `tour-08.jpg`.

## 5. Tour khác (không nổi bật) — bổ sung để danh sách `tours.html` có nhiều lựa chọn hơn

| Tên tour | Hãng du lịch | Điểm đến | Ngày/Đêm | Giá (VND) | Hãng bay | Quốc gia |
|---|---|---|---|---|---|---|
| Bangkok - Pattaya Khám Phá | Vietravel | Bangkok | 4N3Đ | 8.990.000 | Thai Airways | Thái Lan |
| Seoul Mùa Thu Lá Vàng | Saigontourist | Seoul | 5N4Đ | 15.990.000 | Korean Air | Hàn Quốc |
| Tokyo - Osaka Hoa Anh Đào | Fiditour | Tokyo | 5N4Đ | 19.990.000 | Japan Airlines | Nhật Bản |
| Kuala Lumpur Sôi Động | TST Tourist | Kuala Lumpur | 3N2Đ | 6.990.000 | AirAsia | Malaysia |
| Bali Thiên Đường Nhiệt Đới | Vietravel | Bali | 4N3Đ | 10.990.000 | AirAsia | Indonesia |
| Angkor Wat Huyền Bí | Saigontourist | Siem Reap | 3N2Đ | 5.990.000 | Vietnam Airlines | Campuchia |
| Bắc Kinh - Vạn Lý Trường Thành | Fiditour | Bắc Kinh | 5N4Đ | 17.990.000 | Vietnam Airlines | Trung Quốc |
| Dubai Sa Mạc Vàng | Vietravel | Dubai | 5N4Đ | 24.990.000 | Emirates | UAE |

## 6. Lịch trình mẫu (`tour_itinerary`) — ví dụ cho tour #1 "Đà Nẵng - Bà Nà Hills - Hội An"

| Ngày | Tiêu đề | Mô tả |
|---|---|---|
| 1 | TP.HCM - Đà Nẵng - Bà Nà Hills | Bay đến Đà Nẵng, tham quan Bà Nà Hills, Cầu Vàng, làng Pháp. Ăn tối buffet. |
| 2 | Hội An - Phố Cổ | Tham quan Chùa Cầu, phố đèn lồng, trải nghiệm thuyền thúng rừng dừa Bảy Mẫu. |
| 3 | Ngũ Hành Sơn - Tự do - Về TP.HCM | Tham quan Ngũ Hành Sơn, mua sắm đặc sản, ra sân bay về lại TP.HCM. |

Áp dụng mẫu tương tự (2–4 ngày mô tả) cho các tour còn lại khi implement.

## 7. Chuyến bay mẫu (`flights`)

Sinh khoảng 20–30 bản ghi để danh sách `flights.html` có filter thực tế. Gợi ý ma trận sinh dữ liệu (kết hợp origin/destination/airline/ngày/giờ khác nhau):

| origin | destination | airline | trip_type | stop_type | aircraft | giờ đi | giá phổ thông | giá thương gia |
|---|---|---|---|---|---|---|---|---|
| SGN (TP.HCM) | DAD (Đà Nẵng) | Vietnam Airlines | roundtrip | direct | Airbus A321 | 06:15 | 1.590.000 | 4.200.000 |
| SGN | DAD | VietJet Air | oneway | direct | Airbus A320 | 09:40 | 990.000 | 2.800.000 |
| SGN | HAN (Hà Nội) | Bamboo Airways | roundtrip | direct | Boeing 787 | 14:20 | 1.890.000 | 5.100.000 |
| HAN | SGN | Vietnam Airlines | oneway | direct | Airbus A321 | 19:05 | 1.750.000 | 4.600.000 |
| SGN | SIN (Singapore) | Singapore Airlines | roundtrip | direct | Airbus A350 | 08:30 | 3.990.000 | 9.800.000 |
| SGN | BKK (Bangkok) | Thai Airways | oneway | multi_city | Boeing 777 | 11:10 | 2.490.000 | 6.200.000 |
| SGN | ICN (Seoul) | Korean Air | roundtrip | direct | Boeing 787 | 23:50 | 5.990.000 | 13.500.000 |
| SGN | NRT (Tokyo) | Japan Airlines | roundtrip | multi_city | Boeing 787 | 01:15 | 7.490.000 | 16.900.000 |

Khi seed thật, nhân biến thể theo nhiều ngày trong tháng hiện tại/tháng tới để bảng "Số chuyến bay" và filter giờ cất cánh có dữ liệu đa dạng ở đủ 4 khung giờ (00–06h, 06–12h, 12–18h, 18–24h).

## 8. Đơn hàng mẫu (`orders`, `order_items`) — để Dashboard có số liệu ngay khi demo

Seed ~15–20 order giả lập (khách hàng ảo, email dạng `khachN@example.com`), phân bổ:
- Đa số order gắn tour thuộc "Việt Nam" (để pie chart có phần lớn nhất hợp lý), còn lại rải đều các quốc gia khác.
- Trải đều qua nhiều hãng bay khác nhau (để biểu đồ cột top 10 hãng bay có dữ liệu phân hoá, không đều nhau).
- Ngày tạo (`created_at`) nằm trong tháng hiện tại và vài tháng trước, để filter theo tháng của "Dashboard" hoạt động đúng.
