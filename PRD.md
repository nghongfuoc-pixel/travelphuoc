# PRD — Product Requirements Document — TravelViet

## 1. Tổng quan

**Tên sản phẩm:** Du Lịch Việt (TravelViet)
**Mô tả:** Website demo cho phép người dùng tìm kiếm, xem chi tiết và "đặt" chuyến bay / tour du lịch. Toàn bộ chạy phía client, dữ liệu lưu trong SQLite (sql.js) chạy trong trình duyệt — không có backend, không thanh toán thật, không gửi email thật (mô phỏng).

## 2. Đối tượng người dùng

- **Khách (Guest):** duyệt trang chủ, tìm chuyến bay, xem tour, xem chi tiết — chưa cần đăng nhập.
- **Người dùng đã đăng ký (User):** thêm vào giỏ hàng, checkout, xem lịch sử.
- **Quản trị viên (Admin):** quản lý tour, chuyến bay, xem dashboard thống kê.

## 3. Phạm vi (Scope)

**Trong phạm vi:**
- Toàn bộ giao diện tĩnh (HTML/CSS/JS), không backend.
- Dữ liệu lưu và truy vấn bằng SQLite (sql.js) trong trình duyệt, seed sẵn dữ liệu mẫu.
- Đăng ký/đăng nhập giả lập (kiểm tra trong bảng `users` của SQLite).
- Giỏ hàng, checkout giả lập (không thanh toán thật).
- Thông báo "đã gửi email xác nhận" mô phỏng (không gửi email thật qua SMTP vì không có backend).
- Trang Admin với Dashboard thống kê, quản lý CRUD tour/chuyến bay (lưu vào SQLite in-browser).

**Ngoài phạm vi:**
- Thanh toán thực tế (cổng thanh toán, thẻ tín dụng).
- Gửi email thực tế.
- Xác thực bảo mật cấp production (mã hoá mật khẩu chỉ ở mức demo).
- Đồng bộ dữ liệu giữa nhiều thiết bị/người dùng (dữ liệu chỉ tồn tại trong trình duyệt của từng máy).

## 4. Tính năng theo trang

### 4.1 Trang chủ (Home)
- Form tìm chuyến bay: điểm đi, điểm đến, ngày đi (+ ngày về nếu khứ hồi), chọn loại vé (khứ hồi/một chiều). Nút "Tìm kiếm" → điều hướng sang trang Flights kèm query params.
- Danh sách 8 tour du lịch nổi bật: thumbnail 600x400, tên hãng du lịch, số ngày/đêm, giá. Click → trang chi tiết Tour.
- Danh sách logo hãng hàng không (VietJet Air, Vietnam Airlines, Singapore Airlines...). Click logo → trang Flights (lọc theo hãng đó).

### 4.2 Chuyến bay (Flights)
- Sidebar filter: giá (tăng/giảm dần), loại vé (khứ hồi/một chiều), số chặng (bay thẳng/nhiều thành phố), hãng hàng không, khung giờ cất cánh, hạng dịch vụ (phổ thông/thương gia).
- Danh sách kết quả: hãng bay, ngày cất cánh, thời gian bay, giá, dịch vụ đi kèm.
- Click 1 chuyến bay → trang chi tiết chuyến bay.

### 4.3 Chi tiết chuyến bay
- Điểm đi, điểm đến, thời gian bay, hãng bay, loại máy bay (Boeing/Airbus...).
- Chọn hạng vé: Phổ thông hoặc Thương gia (2 mức giá khác nhau).
- Nút "Chọn chuyến bay" → thêm vào Giỏ hàng.

### 4.4 Tour
- Sidebar filter: giá (tăng/giảm dần), hãng hàng không đi kèm tour, khung giờ cất cánh.
- Danh sách tour: hãng bay, ngày cất cánh, thời gian bay, giá, dịch vụ.
- Click 1 tour → trang chi tiết tour.

### 4.5 Chi tiết Tour
- Điểm đi, điểm đến, thời gian bay, hãng bay, loại máy bay.
- Lịch trình chuyến đi (itinerary theo từng ngày).
- Nút "Chọn tour" → thêm vào Giỏ hàng.

### 4.6 Giỏ hàng (Cart)
- Danh sách chuyến bay/tour đã chọn, có thể xoá từng mục hoặc xoá toàn bộ giỏ hàng.
- Form nhập thông tin cá nhân (họ tên, email, SĐT...).
- Nút "Đăng ký" (đặt chỗ) → hiển thị thông báo hoàn thành + mô phỏng email xác nhận gửi từ `nvhai061993@gmail.com` đến email khách hàng đã nhập.

### 4.7 Xác thực (Login / Register / Forgot Password)
- Username: 5–15 ký tự, chỉ chữ và số (không ký tự đặc biệt).
- Password: 5–15 ký tự.
- Tài khoản dựng sẵn:
  - `admin@travel.com` / `Admin123!` → role admin
  - `user@travel.com` / `User123!` → role user
- Forgot Password: form nhập email, mô phỏng gửi link đặt lại mật khẩu.

### 4.8 Trang Admin
Sidebar menu: Dashboard, Tours, Flights, Profile. Chỉ truy cập được khi đăng nhập với role admin.

- **Dashboard:**
  - 4 ô số liệu: số tour trong tháng, số chuyến bay, số khách đặt tour, số khách đặt chuyến bay.
  - Biểu đồ cột: top 10 hãng bay được đặt nhiều nhất.
  - Biểu đồ tròn: tỷ lệ các nước có nhiều khách đặt tour.
  - Bảng: top 10 nước được đặt tour nhiều nhất (cột: quốc gia, số tour, số khách đặt).
  - Danh sách Tours (phân trang 20/trang) và Flights (phân trang 20/trang).
- **Tours:** danh sách + tạo/sửa/xoá tour.
- **Flights:** danh sách + tạo/sửa/xoá chuyến bay.
- **Profile:** thông tin cá nhân admin.

## 5. Yêu cầu phi chức năng

- Giao diện tông sáng, nền trắng, responsive cơ bản.
- Không cần đăng ký tài khoản thật để duyệt trang chủ/tìm kiếm — chỉ bắt buộc đăng nhập khi vào Cart checkout hoặc trang Admin.
- Dữ liệu khởi tạo (seed) phải đủ để demo toàn bộ luồng mà không cần nhập tay.
