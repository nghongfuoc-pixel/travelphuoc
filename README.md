# TravelViet — Du Lịch Việt

Website đặt vé máy bay & tour du lịch, chạy hoàn toàn phía client (không backend).

## Tech stack

| Thành phần | Công nghệ |
|---|---|
| Giao diện | HTML5, CSS3, Vanilla JavaScript (ES6 modules) |
| Cơ sở dữ liệu | SQLite chạy trong trình duyệt qua [sql.js](https://github.com/sql-js/sql.js) (WASM), persist bằng IndexedDB/localStorage |
| Biểu đồ (Dashboard) | Chart.js (cột + pie) |
| Không có | Server, API backend, thanh toán thật, gửi email thật |

## Trạng thái dự án

Đang ở giai đoạn **đặc tả (spec-first)** — chưa sinh code. Xem các tài liệu bên dưới trước khi triển khai `index.html` và các trang còn lại.

## Tài liệu

| File | Nội dung |
|---|---|
| [PRD.md](PRD.md) | Yêu cầu sản phẩm: mục tiêu, phạm vi, tính năng từng trang, vai trò người dùng |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Kiến trúc kỹ thuật, cấu trúc thư mục, cách SQLite chạy trong browser |
| [DATABASE.md](DATABASE.md) | Schema SQLite: bảng, cột, quan hệ |
| [ROUTES.md](ROUTES.md) | Danh sách trang, luồng điều hướng, quyền truy cập |
| [UI_SPEC.md](UI_SPEC.md) | Đặc tả giao diện chi tiết từng trang |
| [SEED_DATA.md](SEED_DATA.md) | Dữ liệu mẫu: tài khoản, tour, chuyến bay, hãng bay |
| [ACCEPTANCE.md](ACCEPTANCE.md) | Tiêu chí nghiệm thu cho từng chức năng |
| [prompt.txt](prompt.txt) | Yêu cầu gốc từ người dùng |

## Cách chạy (sau khi có code)

Dự án tĩnh, không cần build. Mở `index.html` trực tiếp bằng trình duyệt, hoặc chạy qua local server tĩnh bất kỳ (vì `sql.js` cần tải file `.wasm` qua HTTP, không mở được bằng `file://` trên một số trình duyệt).
