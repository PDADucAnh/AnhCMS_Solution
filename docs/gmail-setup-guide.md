# Hướng dẫn cấu hình gửi Email tự động qua Gmail (SMTP Setup Guide)

Tài liệu này hướng dẫn cách kết nối hệ thống gửi email đơn hàng tự động của **AnhCMS Boutique** về Gmail thật của người dùng thông qua giao thức SMTP.

---

## BƯỚC 1: Tạo Mật khẩu Ứng dụng (App Password) trên Tài khoản Google

Vì lý do bảo mật, Google chặn không cho ứng dụng bên thứ ba đăng nhập trực tiếp bằng mật khẩu Gmail thông thường của bạn. Bạn phải tạo một mật khẩu ứng dụng gồm 16 ký tự riêng biệt:

1. Truy cập trang quản lý tài khoản Google của bạn tại: [Tài khoản Google của tôi](https://myaccount.google.com/).
2. Chọn mục **Bảo mật (Security)** ở danh sách bên trái.
3. Tại phần **Cách bạn đăng nhập vào Google (How you sign in to Google)**:
   * Hãy chắc chắn rằng **Xác minh 2 bước (2-Step Verification)** đã được **Bật (ON)**. Nếu chưa bật, vui lòng kích hoạt trước.
4. Bấm chọn vào mục **Xác minh 2 bước (2-Step Verification)**, cuộn xuống dưới cùng của trang và nhấp chọn **Mật khẩu ứng dụng (App passwords)**.
5. Tạo mật khẩu mới:
   * Điền tên gợi nhớ tùy ý vào ô nhập (ví dụ: `AnhCMS SMTP`).
   * Nhấn nút **Tạo (Create)**.
6. Google sẽ hiển thị một cửa sổ chứa mật khẩu ngẫu nhiên gồm **16 ký tự viết liền** (ví dụ: `abcdefghijklmnop`). Hãy **sao chép** mã này lại (đây chính là mật khẩu SMTP dùng cho mã nguồn của bạn).

---

## BƯỚC 2: Thiết lập kết nối SMTP trong tệp `appsettings.json`

Mở tệp cấu hình Backend tại đường dẫn `CMS.Backend/appsettings.json` và thay thế/bổ sung cấu hình phần `EmailSettings` như sau:

```json
  "EmailSettings": {
    "SmtpHost": "smtp.gmail.com",
    "SmtpPort": 587,
    "SenderEmail": "email-cua-ban@gmail.com",
    "SenderName": "AnhCMS Boutique",
    "EnableSsl": true,
    "Username": "email-cua-ban@gmail.com",
    "Password": "mat-khau-16-ky-tu-vừa-tao"
  }
```

### Chi tiết các tham số cấu hình:
*   `SmtpHost`: Giữ nguyên `"smtp.gmail.com"` (Máy chủ SMTP chính thức của Google).
*   `SmtpPort`: Giữ nguyên `587` (Cổng kết nối TLS bảo mật).
*   `SenderEmail`: Nhập địa chỉ Gmail của bạn (địa chỉ sẽ gửi thư đi).
*   `SenderName`: Tên đại diện hiển thị ở mục người gửi trong hòm thư của khách hàng (ví dụ: `AnhCMS Boutique`).
*   `EnableSsl`: Giữ nguyên `true` để kích hoạt giao thức bảo mật SSL/TLS.
*   `Username`: Địa chỉ Gmail của bạn (trùng với `SenderEmail`).
*   `Password`: Nhập **Mật khẩu ứng dụng gồm 16 ký tự** vừa tạo ở Bước 1 (viết liền nhau, không chứa dấu cách).

---

## BƯỚC 3: Khởi động lại hệ thống Backend

Sau khi lưu thay đổi trong tệp `appsettings.json`, hãy khởi động lại ứng dụng Backend để cấu hình mới có hiệu lực. 

Giờ đây, mỗi khi trạng thái đơn hàng của khách hàng chuyển sang **Đã xác nhận (Confirmed)** hoặc **Đã hoàn thành (Completed)**, hệ thống sẽ tự động sử dụng tài khoản Gmail thật của bạn để gửi email chi tiết hóa đơn đến hòm thư của khách hàng.
