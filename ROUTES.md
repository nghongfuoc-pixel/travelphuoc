# ROUTES.md — TravelViet

Website dạng multi-page (không SPA). Mỗi dòng dưới đây là 1 file `.html` thật.

## 1. Trang công khai (Public)

| Route | File | Mô tả | Query params |
|---|---|---|---|
| `/` | `index.html` | Trang chủ: form tìm chuyến bay, 8 tour nổi bật, logo hãng bay | — |
| `/flights` | `flights.html` | Danh sách chuyến bay + filter | `from, to, date, returnDate, tripType(oneway\|roundtrip)` |
| `/flight-detail` | `flight-detail.html` | Chi tiết 1 chuyến bay, chọn hạng vé | `id` (flight id) |
| `/tours` | `tours.html` | Danh sách tour + filter | `airline, sort` |
| `/tour-detail` | `tour-detail.html` | Chi tiết tour, lịch trình | `id` (tour id) |
| `/cart` | `cart.html` | Giỏ hàng, nhập thông tin, đặt chỗ | — |
| `/login` | `login.html` | Đăng nhập | `redirect` (quay lại trang trước sau khi login) |
| `/register` | `register.html` | Đăng ký | — |
| `/forgot-password` | `forgot-password.html` | Quên mật khẩu | — |

## 2. Trang cá nhân (yêu cầu đăng nhập — role `user` hoặc `admin`)

| Route | File | Mô tả |
|---|---|---|
| `/profile` | `profile.html` | Thông tin cá nhân người dùng thường |

## 3. Trang Admin (yêu cầu đăng nhập — role `admin`)

| Route | File | Mô tả |
|---|---|---|
| `/admin` | `admin/dashboard.html` | Dashboard: 4 ô số liệu, biểu đồ cột, biểu đồ tròn, bảng top quốc gia, list tour/flight phân trang |
| `/admin/tours` | `admin/tours.html` | Danh sách tour (quản lý, xoá) |
| `/admin/tours/new` | `admin/tour-form.html` | Tạo tour mới |
| `/admin/tours/edit` | `admin/tour-form.html?id=` | Sửa tour |
| `/admin/flights` | `admin/flights.html` | Danh sách chuyến bay (quản lý, xoá) |
| `/admin/flights/new` | `admin/flight-form.html` | Tạo chuyến bay mới |
| `/admin/flights/edit` | `admin/flight-form.html?id=` | Sửa chuyến bay |
| `/admin/profile` | `admin/profile.html` | Thông tin cá nhân admin |

## 4. Luồng điều hướng chính

```
index.html
 ├─(submit form tìm chuyến bay)──> flights.html?from=..&to=..&date=..&tripType=..
 ├─(click 1 trong 8 tour nổi bật)─> tour-detail.html?id=..
 └─(click logo hãng bay)──────────> flights.html?airline=..

flights.html ──(click 1 chuyến bay)──> flight-detail.html?id=..
flight-detail.html ──(chọn hạng vé, "Chọn chuyến bay")──> cart.html (đã thêm item)

tours.html ──(click 1 tour)──> tour-detail.html?id=..
tour-detail.html ──("Chọn tour")──> cart.html (đã thêm item)

cart.html ──(chưa đăng nhập, bấm "Đăng ký")──> login.html?redirect=cart.html
cart.html ──(đã đăng nhập, xác nhận thông tin, "Đăng ký")──> modal "Đặt chỗ thành công" (mô phỏng email)

login.html ──(đăng nhập thành công, role=admin)──> admin/dashboard.html
login.html ──(đăng nhập thành công, role=user)───> trang trước đó (redirect param) hoặc index.html
register.html ──(đăng ký thành công)──> login.html
forgot-password.html ──(gửi yêu cầu)──> thông báo mô phỏng đã gửi email đặt lại mật khẩu

admin/dashboard.html ──(sidebar)──> admin/tours.html | admin/flights.html | admin/profile.html
admin/tours.html ──("Tạo tour")──> admin/tour-form.html
admin/tours.html ──(click 1 dòng / "Sửa")──> admin/tour-form.html?id=..
admin/flights.html ──("Tạo chuyến bay")──> admin/flight-form.html
admin/flights.html ──(click 1 dòng / "Sửa")──> admin/flight-form.html?id=..
```

## 5. Guard truy cập (client-side)

- Mọi trang trong `admin/*` và `cart.html` (bước checkout) phải kiểm tra `sessionStorage` khi `DOMContentLoaded`:
  - Không có session → redirect `login.html?redirect=<trang hiện tại>`.
  - Có session nhưng `role !== 'admin'` khi vào `admin/*` → redirect `index.html` (hoặc trang 403 đơn giản).
- Đây là guard phía client (demo), không thay thế cho bảo mật thật vì không có backend.
