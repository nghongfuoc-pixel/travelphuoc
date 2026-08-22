# UI_SPEC.md — Đặc tả giao diện — TravelViet

## 1. Bảng màu & typography (tông sáng, nền trắng)

| Token | Giá trị gợi ý | Dùng cho |
|---|---|---|
| `--color-bg` | `#FFFFFF` | nền chính toàn site |
| `--color-bg-alt` | `#F7F9FC` | nền section xen kẽ, card nhẹ |
| `--color-primary` | `#0F79E0` | brand chính (nút, link, header) — gợi ý xanh dương du lịch |
| `--color-secondary` | `#00B894` | nhấn phụ (giá, badge khuyến mãi) — xanh lá |
| `--color-accent` | `#FF7A00` | CTA nổi bật (nút "Tìm kiếm", "Đặt chỗ") |
| `--color-text` | `#1A1A1A` | chữ chính |
| `--color-text-muted` | `#6B7280` | chữ phụ |
| `--color-border` | `#E5E7EB` | viền card, input |
| Font | hệ thống (`-apple-system, Segoe UI, Roboto, sans-serif`) | toàn site |

## 2. Trang chủ (`index.html`)

**Header:** logo TravelViet trái, menu (Trang chủ / Chuyến bay / Tour) giữa, nút Đăng nhập/Đăng ký (hoặc avatar user) phải.

**Hero + Search box:**
- Tabs: "Vé khứ hồi" / "Vé một chiều".
- Hàng input: Điểm đi, Điểm đến (có nút hoán đổi ⇄), Ngày đi, Ngày về (ẩn nếu một chiều).
- Nút "Tìm kiếm" (accent color, nổi bật) → `flights.html`.

**Section "Tour nổi bật":**
- Tiêu đề "Tour du lịch nổi bật".
- Grid 4 cột (desktop) / 2 cột (tablet) / 1 cột (mobile), 8 card tour.
- Mỗi card: ảnh thumbnail 600x400 (tỷ lệ 3:2), tên hãng du lịch, badge số ngày/đêm (VD "4N3Đ"), giá (màu secondary, đậm), toàn card click được → `tour-detail.html?id=`.

**Section "Hãng hàng không":**
- Tiêu đề "Đối tác hãng hàng không".
- Hàng logo (grayscale nhẹ, hover lên màu), click từng logo → `flights.html?airline=`.

**Footer:** thông tin liên hệ, liên kết nhanh, đơn giản.

## 3. Trang Flights (`flights.html`)

**Layout 2 cột:** sidebar trái (280px) + danh sách kết quả phải (flex-grow).

**Sidebar filter (trái):**
- Sắp xếp giá: radio/select "Giá tăng dần" / "Giá giảm dần".
- Loại vé: checkbox "Khứ hồi" / "Một chiều".
- Số chặng: checkbox "Bay thẳng" / "Nhiều thành phố".
- Hãng hàng không: checkbox list (đa chọn), kèm logo nhỏ.
- Giờ cất cánh: nhóm khung giờ (00:00–06:00, 06:00–12:00, 12:00–18:00, 18:00–24:00) dạng checkbox.
- Hạng dịch vụ: checkbox "Phổ thông" / "Thương gia".
- Nút "Xoá bộ lọc".

**Danh sách kết quả (phải):**
- Thanh trên cùng: số kết quả tìm thấy, tóm tắt tìm kiếm (from → to, ngày).
- Mỗi dòng kết quả (card ngang): logo hãng bay trái, giờ đi–giờ đến + thời lượng bay giữa, giá + nút "Chọn" phải.
- Click cả dòng → `flight-detail.html?id=`.
- Trạng thái rỗng: thông báo "Không tìm thấy chuyến bay phù hợp" khi filter không có kết quả.

## 4. Trang chi tiết chuyến bay (`flight-detail.html`)

- Card tổng quan trên: điểm đi → điểm đến (icon máy bay), giờ bay, ngày, hãng bay (logo + tên), loại máy bay (VD "Airbus A321").
- **Bảng chọn hạng vé** (2 cột cạnh nhau, giống hình mẫu dạng bảng so sánh):

| | Phổ Thông | Thương Gia |
|---|---|---|
| Giá | xxx VND | xxx VND |
| Hành lý | ... | ... |
| Suất ăn | ... | ... |
| Đổi/hoàn vé | ... | ... |
| Nút chọn | "Chọn Phổ Thông" | "Chọn Thương Gia" |

- Bấm chọn 1 hạng vé → thêm vào giỏ hàng (toast/banner xác nhận "Đã thêm vào giỏ hàng" + link "Xem giỏ hàng").

## 5. Trang Tour (`tours.html`)

Layout 2 cột giống Flights:
- Sidebar filter: sắp xếp giá tăng/giảm, hãng hàng không đi kèm, khung giờ cất cánh.
- Danh sách kết quả: card ngang — hãng bay, ngày cất cánh, thời gian bay, giá, dịch vụ đi kèm (tương tự flights nhưng đại diện cho tour). Click → `tour-detail.html?id=`.

## 6. Trang chi tiết Tour (`tour-detail.html`)

- Card tổng quan: điểm đi, điểm đến, thời gian bay, hãng bay, loại máy bay (giống flight-detail).
- **Lịch trình chuyến đi:** timeline/accordion theo từng ngày (Ngày 1, Ngày 2...), mỗi ngày có tiêu đề + mô tả chi tiết.
- Nút "Chọn tour" (accent, sticky ở cuối trang trên mobile) → thêm vào giỏ hàng.

## 7. Giỏ hàng (`cart.html`)

- Danh sách item: mỗi dòng gồm ảnh/icon loại (flight/tour), tên, thông tin ngắn (ngày, hạng vé nếu là flight), giá, nút xoá (icon thùng rác).
- Tổng cộng (subtotal) hiển thị rõ cuối danh sách.
- Nút "Xoá giỏ hàng" (secondary/outline, cần confirm).
- Form thông tin cá nhân: Họ tên, Email, Số điện thoại (bắt buộc, validate cơ bản).
- Nút "Đăng ký" (accent, lớn) → nếu chưa đăng nhập, chuyển sang login trước; nếu đã đăng nhập, xử lý đặt chỗ.
- Sau khi đặt chỗ thành công: modal "🎉 Đặt chỗ thành công!" + dòng "Email xác nhận đã được gửi đến {email}" (mô phỏng, không gửi thật).

## 8. Login / Register / Forgot Password

- Form đơn giản, căn giữa màn hình, card trắng bo góc, shadow nhẹ trên nền `--color-bg-alt`.
- Login: Username/Email + Password, checkbox "Ghi nhớ đăng nhập", link "Quên mật khẩu?", link "Chưa có tài khoản? Đăng ký".
- Register: Username, Email, Password, Xác nhận Password. Validate inline: username 5–15 ký tự không ký tự đặc biệt, password 5–15 ký tự — hiện lỗi ngay dưới input khi sai.
- Forgot Password: chỉ 1 input Email + nút gửi, sau khi gửi hiện thông báo mô phỏng.

## 9. Trang Admin

**Layout chung:** sidebar trái cố định (240px, nền `--color-bg-alt` hoặc primary đậm), nội dung chính bên phải.

**Sidebar:** logo nhỏ trên cùng, menu items (icon + label): Dashboard, Tours, Flights, Profile; item active có highlight primary.

**Dashboard:**
- Hàng 4 ô số liệu (grid 4 cột desktop / 2 cột mobile): icon, số lớn, label nhỏ bên dưới. VD: "128 — Tour trong tháng".
- Hàng biểu đồ (2 cột): trái là biểu đồ cột (top 10 hãng bay), phải là biểu đồ tròn (tỷ lệ quốc gia).
- Bảng "Top 10 quốc gia": cột Quốc gia | Số tour | Số khách đặt vé, header sticky, hàng zebra nhẹ.
- 2 danh sách cuối trang (List Tours, List Flights) dạng bảng, phân trang 20 dòng/trang (control phân trang ở cuối bảng: « 1 2 3 ... »).

**Tours / Flights (quản lý):**
- Bảng danh sách + nút "Tạo tour"/"Tạo chuyến bay" góc trên phải + nút Sửa/Xoá mỗi dòng.
- Form tạo/sửa: các trường tương ứng schema trong [DATABASE.md](DATABASE.md), validate bắt buộc các trường NOT NULL.

**Profile:** card thông tin cá nhân (tên, email, vai trò), form cập nhật cơ bản.

## 10. Responsive

- Breakpoint: `≤768px` (mobile), `769–1024px` (tablet), `>1024px` (desktop).
- Sidebar filter (Flights/Tours) chuyển thành drawer/accordion có thể mở/đóng trên mobile.
- Sidebar Admin chuyển thành menu hamburger trên mobile.
