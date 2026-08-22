# ACCEPTANCE.md — Tiêu chí nghiệm thu — TravelViet

Mỗi mục dạng checklist, dùng để kiểm thử thủ công sau khi implement từng trang.

## 1. Trang chủ

- [ ] Form tìm chuyến bay có đủ: điểm đi, điểm đến, ngày đi, toggle khứ hồi/một chiều (ngày về chỉ hiện khi chọn khứ hồi).
- [ ] Bấm "Tìm kiếm" điều hướng đến `flights.html` kèm đúng query params đã nhập.
- [ ] Hiển thị đúng 8 tour nổi bật, mỗi card có ảnh 600x400, tên hãng du lịch, số ngày/đêm, giá.
- [ ] Click vào 1 card tour → mở đúng `tour-detail.html?id=` của tour đó.
- [ ] Hiển thị đủ logo các hãng hàng không đã seed; click logo → `flights.html` có lọc sẵn theo hãng đó.

## 2. Chuyến bay (Flights)

- [ ] Sidebar hiển thị đủ filter: sắp xếp giá, loại vé, số chặng, hãng hàng không, khung giờ, hạng dịch vụ.
- [ ] Đổi "Giá tăng dần" / "Giá giảm dần" sắp xếp lại danh sách đúng thứ tự.
- [ ] Kết hợp nhiều filter cùng lúc (VD: chọn 2 hãng + khung giờ) trả về đúng tập kết quả giao nhau.
- [ ] Không có kết quả nào khớp filter → hiển thị trạng thái rỗng, không lỗi trắng trang.
- [ ] Click 1 chuyến bay → sang đúng `flight-detail.html?id=` tương ứng.

## 3. Chi tiết chuyến bay

- [ ] Hiển thị đúng điểm đi, điểm đến, giờ bay, hãng bay, loại máy bay của chuyến bay được chọn.
- [ ] Hiển thị 2 lựa chọn hạng vé (Phổ thông / Thương gia) với giá khác nhau.
- [ ] Chọn 1 hạng vé → item được thêm vào giỏ hàng (kiểm tra qua `cart.html` thấy đúng item + đúng giá theo hạng đã chọn).

## 4. Tour

- [ ] Sidebar filter (giá, hãng bay, khung giờ) hoạt động đúng, tương tự Flights.
- [ ] Danh sách tour hiển thị đủ hãng bay, ngày cất cánh, thời gian bay, giá, dịch vụ.
- [ ] Click 1 tour → sang đúng `tour-detail.html?id=`.

## 5. Chi tiết Tour

- [ ] Hiển thị điểm đi, điểm đến, thời gian bay, hãng bay, loại máy bay.
- [ ] Lịch trình hiển thị đủ số ngày đã seed, đúng nội dung từng ngày.
- [ ] Bấm "Chọn tour" → item được thêm vào giỏ hàng.

## 6. Giỏ hàng

- [ ] Hiển thị đúng toàn bộ item đã thêm (cả flight và tour), đúng giá.
- [ ] Xoá 1 item → chỉ item đó biến mất, tổng tiền cập nhật lại đúng.
- [ ] "Xoá giỏ hàng" → toàn bộ item biến mất, có bước xác nhận trước khi xoá.
- [ ] Form thông tin cá nhân bắt buộc nhập đủ Họ tên/Email/SĐT trước khi submit, báo lỗi rõ ràng nếu thiếu/sai định dạng.
- [ ] Bấm "Đăng ký" khi chưa đăng nhập → chuyển hướng sang `login.html`, sau khi login thành công quay lại đúng `cart.html` với giỏ hàng còn nguyên.
- [ ] Đặt chỗ thành công → hiện thông báo hoàn thành + dòng mô phỏng email gửi từ `nvhai061993@gmail.com` đến đúng email khách vừa nhập; giỏ hàng được xoá sau khi đặt thành công.

## 7. Đăng nhập / Đăng ký / Quên mật khẩu

- [ ] Đăng nhập đúng với `admin@travel.com` / `Admin123!` → vào được `admin/dashboard.html`.
- [ ] Đăng nhập đúng với `user@travel.com` / `User123!` → vào được các trang user thường, **không** vào được `/admin/*`.
- [ ] Đăng nhập sai mật khẩu/email không tồn tại → báo lỗi, không cho vào.
- [ ] Đăng ký: username < 5 hoặc > 15 ký tự → báo lỗi, không cho submit.
- [ ] Đăng ký: username chứa ký tự đặc biệt (VD `@`, `!`, khoảng trắng) → báo lỗi.
- [ ] Đăng ký: password < 5 hoặc > 15 ký tự → báo lỗi.
- [ ] Đăng ký với email/username đã tồn tại → báo lỗi trùng, không tạo user mới.
- [ ] Quên mật khẩu: nhập email hợp lệ → hiển thị thông báo mô phỏng đã gửi hướng dẫn.

## 8. Bảo vệ truy cập (Route guard)

- [ ] Chưa đăng nhập, truy cập trực tiếp URL `admin/dashboard.html` → bị redirect về `login.html`.
- [ ] Đăng nhập role `user`, truy cập trực tiếp URL bất kỳ trong `admin/*` → bị chặn/redirect, không thấy được dữ liệu admin.
- [ ] Refresh trang (F5) khi đã đăng nhập → vẫn giữ trạng thái đăng nhập trong phiên làm việc hiện tại (session còn hiệu lực).

## 9. Admin — Dashboard

- [ ] 4 ô số liệu hiển thị đúng số liệu tính từ dữ liệu SQLite hiện có (không hardcode).
- [ ] Biểu đồ cột hiển thị đúng top 10 hãng bay theo số lượt đặt, sắp xếp giảm dần.
- [ ] Biểu đồ tròn thể hiện đúng tỷ lệ % các quốc gia có khách đặt tour, tổng = 100%.
- [ ] Bảng top 10 quốc gia có đủ 3 cột (quốc gia, số tour, số khách đặt vé), sắp xếp hợp lý (VD theo số khách giảm dần).
- [ ] List Tours và List Flights có phân trang đúng 20 dòng/trang, chuyển trang hoạt động đúng, không mất dữ liệu.

## 10. Admin — Quản lý Tours / Flights

- [ ] Tạo tour mới với đầy đủ trường bắt buộc → xuất hiện ngay trong danh sách tour (cả `admin/tours.html` lẫn `tours.html` phía người dùng).
- [ ] Sửa 1 tour → thay đổi phản ánh đúng ở cả trang admin và trang người dùng.
- [ ] Xoá 1 tour → biến mất khỏi danh sách, không gây lỗi nếu tour đó đang có trong giỏ hàng/đơn hàng cũ (xử lý mềm dẻo, không crash).
- [ ] Tương tự cho Flights: tạo / sửa / xoá hoạt động đúng và đồng bộ hai phía.
- [ ] Dữ liệu vẫn còn sau khi tải lại trang (F5) — xác nhận việc persist SQLite vào IndexedDB hoạt động đúng.

## 11. Admin — Profile

- [ ] Hiển thị đúng thông tin tài khoản admin đang đăng nhập.
- [ ] Cập nhật thông tin cá nhân (nếu có form) → lưu lại và hiển thị đúng sau khi reload.

## 12. Giao diện chung

- [ ] Toàn site nền trắng, tông màu sáng nhất quán theo [UI_SPEC.md](UI_SPEC.md).
- [ ] Responsive cơ bản hoạt động tốt ở 3 kích thước: mobile (≤768px), tablet, desktop.
- [ ] Không có lỗi console JavaScript nghiêm trọng khi thao tác qua các luồng chính ở trên.
