# 🚀 TÀI LIỆU DỰ ÁN: AnhCMS_Solution
### 🌐 Full-Stack ASP.NET Core & ReactJS

> **💡 Tổng quan:** Dự án AnhCMS_Solution là một hệ thống Website Full-Stack kết hợp giữa nền tảng Thương mại điện tử (bán hàng thời trang công sở & dạ hội) và Hệ thống quản trị nội dung tin tức/blog.

---

## 📑 Mục lục
1. [Định hướng và Mục tiêu dự án](#-1-định-hướng-và-mục-tiêu-dự-án)
2. [Môi trường & Công nghệ (Tech Stack)](#️-2-môi-trường--công-nghệ-tech-stack)
3. [Kiến trúc Solution 3 lớp](#️-3-kiến-trúc-solution-3-lớp)
4. [Cấu trúc Cơ sở dữ liệu (Database Schema)](#-4-cấu-trúc-cơ-sở-dữ-liệu-database-schema)
5. [Lộ trình phát triển dự án](#-5-lộ-trình-phát-triển-dự-án-theo-từng-buổi)
6. [Những lưu ý kỹ thuật cốt lõi](#️-6-những-lưu-ý-kỹ-thuật-cốt-lõi)

---

## 📌 1. ĐỊNH HƯỚNG VÀ MỤC TIÊU DỰ ÁN

Hệ thống được thiết kế theo **kiến trúc Lai (Hybrid)** và **phân tách trách nhiệm (Decoupling)**:

* 🖥️ **Backend:** Đóng vai trò cung cấp giao diện quản trị Admin bằng kiến trúc ASP.NET Core MVC truyền thống, đồng thời mở các cổng RESTful Web API để cung cấp dữ liệu thô (chuẩn JSON) cho các nền tảng khác. Việc Backend chỉ trả về dữ liệu thô giúp tiết kiệm băng thông và tối ưu tốc độ tải trang.
* ⚛️ **Frontend:** Chuyển đổi tư duy từ Render phía Server sang Render phía Client bằng ReactJS (Single Page Application). ReactJS tự động gọi API lấy dữ liệu thực tế từ Database thông qua Axios và hiển thị lên giao diện.

---

## ⚙️ 2. MÔI TRƯỜNG & CÔNG NGHỆ (TECH STACK)

| Phân hệ | Công nghệ & Công cụ sử dụng |
| :--- | :--- |
| **Backend** | .NET 6.0 / .NET 8.0 SDK, ASP.NET Core MVC, ASP.NET Core Web API |
| **Frontend** | ReactJS, Axios, Bootstrap 4.6/5, FontAwesome |
| **Database** | SQL Server (Express/LocalDB), Entity Framework Core (Code-First Migration) |
| **Công cụ** | Visual Studio 2022 *(cài đặt workload ASP.NET and web development & .NET desktop)*, SSMS, Node.js (LTS), Postman, Swagger UI |

---

## 🏗 3. KIẾN TRÚC SOLUTION 3 LỚP

Dự án được chia thành 3 Project độc lập để dễ dàng quản lý mã nguồn:

1. 📦 **CMS.Data (Lớp Dữ liệu):** Class Library chứa lớp `ApplicationDbContext` và định nghĩa toàn bộ 8 thực thể (Entities) của Database.
2. ⚙️ **CMS.Backend (Lớp Xử lý):** Đóng vai trò là "trạm điều khiển" cung cấp giao diện quản trị Admin (Controller, View) và mở các cổng Web API RESTful. Lớp này được cấu hình Reference tới `CMS.Data`.
3. 🎨 **cms.frontend (Lớp Giao diện):** Ứng dụng ReactJS giao tiếp với Backend qua cổng API.

---

## 🗄 4. CẤU TRÚC CƠ SỞ DỮ LIỆU (DATABASE SCHEMA)

Hệ thống gồm 8 bảng có mối quan hệ chặt chẽ với nhau:

| Tên Bảng | Mô tả & Trường dữ liệu cốt lõi |
| :--- | :--- |
| **Categories** | Danh mục tin tức blog. Khóa chính `Id`, `Name`, `Description`. |
| **Posts** | Bài viết. `Title`, `Content`, `ImageUrl`, khóa ngoại `CategoryId`. |
| **Users** | Quản trị viên hệ thống. `Username`, `PasswordHash`, `FullName`, `Role`. |
| **CategoriesProducts**| Danh mục sản phẩm thời trang. `Id`, `Name`, `Description`. |
| **Products** | Sản phẩm. `Name`, `Price`, `StockQuantity`, `ImageUrl`, khóa ngoại `CategoryProductId`. |
| **Customers** | Khách hàng mua sắm trực tuyến. `FullName`, `Email`, `Address`, `Password`. |
| **Orders** | Đơn hàng. `OrderDate`, `Status` (0: Chờ duyệt, 1: Đang giao, 2: Đã xong), `Notes`, khóa ngoại `CustomerId`. |
| **OrderDetails** | Chi tiết đơn hàng. Số lượng `Quantity`, giá mua `UnitPrice`, khóa ngoại `OrderId` và `ProductId`. |

---

## 🗓 5. LỘ TRÌNH PHÁT TRIỂN DỰ ÁN (THEO TỪNG BUỔI)

### 🟢 Giai đoạn 1: Nền tảng Backend & Cơ sở dữ liệu
* **Buổi 1: Khởi tạo kiến trúc dự án**
  * Tạo Blank Solution và thiết lập cấu trúc 3 lớp (Data, Backend, Frontend).
  * Viết mã các Class Entity chuẩn hóa.
  * Tạo dữ liệu giả (Mock Data) trong Controller để hiển thị lên View `.cshtml` nhằm kiểm tra kết nối giữa các project.
* **Buổi 2: Kết nối Database với EF Core**
  * Cài đặt NuGet Packages (`SqlServer`, `Tools`, `Design`).
  * Tạo `ApplicationDbContext` và cấu hình Connection String trong `appsettings.json`.
  * Sử dụng kỹ thuật Code-First Migration (`Add-Migration InitialCreate` và `Update-Database`) để sinh tự động các bảng vào SQL Server.
* **Buổi 3: Truy vấn LINQ & Thao tác dữ liệu (CRUD)**
  * Áp dụng LINQ (`Where`, `OrderByDescending`, `Take`) để lọc và sắp xếp dữ liệu.
  * Sử dụng lệnh `.Include()` (Eager Loading) để Join bảng (ví dụ: lấy tên Danh mục kèm theo Bài viết) tránh lỗi dữ liệu rỗng.
  * Thực hiện đầy đủ quy trình Thêm - Xóa - Sửa và lưu vào SQL bằng `SaveChanges()`.

### 🟡 Giai đoạn 2: Xây dựng Admin Panel, Bảo mật & Web API
* **Buổi 4: Giao diện Quản trị Toàn diện (Admin Panel)**
  * Xây dựng `_LayoutAdmin.cshtml` kết hợp Bootstrap với Sidebar điều hướng tĩnh.
  * Xử lý logic Upload hình ảnh (`IFormFile`) vào thư mục `wwwroot/uploads` với tên file sinh ngẫu nhiên bằng `Guid`.
  * Tích hợp trình soạn thảo văn bản CKEditor 5 để biên tập nội dung, dùng `@Html.Raw()` hiển thị mã HTML.
* **Buổi 5: Bảo mật & Phân quyền (Security & Identity)**
  * Cấu hình dịch vụ xác thực `CookieAuthentication` trong `Program.cs`.
  * Xây dựng luồng Đăng nhập (Login Flow) cấp thẻ bài qua Claims (lưu Username, Role).
  * Áp dụng Attribute `[Authorize]` để khóa trang quản trị, và `[Authorize(Roles="Admin")]` để phân quyền chặt chẽ.
* **Buổi 6: Khởi tạo Web API chuẩn RESTful**
  * Cấu hình kiến trúc Lai (Hybrid) chạy song song MVC và API trên cùng một Backend.
  * Cài đặt Swagger sinh tài liệu API tự động để kiểm thử.
  * Thiết kế API Controllers (`[ApiController]`, `[Route("api/[controller]")]`) với các phương thức GET, POST.
  * Áp dụng kỹ thuật Projection (`.Select()`) để gọt tỉa dữ liệu thừa trước khi trả về chuỗi JSON.
  * Test API nhận Đơn hàng (POST) qua công cụ Postman bằng chuỗi JSON thô.

### 🔵 Giai đoạn 3: Kết nối Frontend ReactJS (Client-Side)
* **Buổi 7: Khởi tạo ReactJS & Cấu hình CORS**
  * Mở cửa bảo mật CORS trên Backend (`AllowAnyOrigin`, `AllowAnyMethod`).
  * Khởi tạo ReactJS (`npx create-react-app`), cài đặt thư viện `axios`.
  * Tạo file cấu hình tập trung `axiosClient.js` và viết Service lấy danh mục sản phẩm từ API.
* **Buổi 8: Vòng đời Component & Hook useEffect**
  * Nắm vững cơ chế `useEffect` để kích hoạt việc gọi API (Side Effects).
  * Sử dụng Hook `useState` kết hợp `async/await` để quản lý trạng thái dữ liệu và vòng tải (Loading).
  * Gọi API lấy danh sách Bài viết và Danh mục blog thời trang, xử lý định dạng tiền tệ và ngày tháng (`toLocaleDateString('vi-VN')`).

### 🟣 Giai đoạn 4: Tính năng Nâng cao (Dự kiến lộ trình chuẩn)
* **Buổi 9:** Ứng dụng React Router Dom để làm chức năng điều hướng chi tiết trang bài viết (SPA).
* **Buổi 10:** Xây dựng Giỏ hàng (Cart), truyền đối tượng đơn hàng lên Web API; giới thiệu gRPC Service.
* **Buổi 11:** Kỹ năng gỡ lỗi (Debug) bằng Chrome DevTools, sửa lỗi API, tối ưu SEO cơ bản.
* **Buổi 12:** Tổng kết, Demo ứng dụng E-Commerce Full-stack và bảo vệ đồ án.

---

## ⚠️ 6. NHỮNG LƯU Ý KỸ THUẬT CỐT LÕI

> ⚠️ **Cảnh báo:** Việc bỏ qua các lưu ý dưới đây có thể dẫn đến các lỗi nghiêm trọng về bảo mật, hiệu năng hoặc sập hệ thống.

### 🔴 1. Cấu hình CORS
Middleware `app.UseCors("TênPolicy")` bắt buộc phải nằm **chính xác** giữa `app.UseRouting()` và `app.UseAuthorization()` trong file `Program.cs`. Nếu sai vị trí, ReactJS sẽ bị lỗi *Network Error*.
```csharp
app.UseRouting();
app.UseCors("AllowAll"); // <-- BẮT BUỘC nằm ở đây
app.UseAuthorization();
```

### 🔴 2. Chống lặp vô hạn ở ReactJS
Khi sử dụng Hook `useEffect` để fetch data, bắt buộc phải truyền **mảng phụ thuộc rỗng `[]`** vào tham số thứ hai để API chỉ gọi 1 lần duy nhất khi render.
```javascript
useEffect(() => {
    fetchDataFromAPI();
}, []); // Mảng rỗng ngăn chặn vòng lặp vô hạn
```

### 🔴 3. Tối ưu gói tin JSON
Khi viết Web API lấy danh sách dữ liệu, nên sử dụng cú pháp LINQ `.Select()` để loại bỏ các cột không cần thiết, giúp web tải nhanh hơn.
```csharp
// Chỉ lấy những trường cần thiết
var data = await _context.Posts.Select(x => new { x.Id, x.Title }).ToListAsync();
```

### 🔴 4. Kiểm soát cập nhật Mật khẩu
Trong chức năng Sửa (Edit) User Admin, phải xử lý logic `if (!string.IsNullOrEmpty(NewPassword))` để quyết định sử dụng mật khẩu mới hay giữ nguyên mã Hash cũ, tránh làm mất mật khẩu khi người dùng để trống form.
```csharp
if (!string.IsNullOrEmpty(userDto.NewPassword))
{
    // Mã hóa và cập nhật mật khẩu mới
}
// Ngược lại: Giữ nguyên PasswordHash cũ trong DB
```

### 🔴 5. Ràng buộc toàn vẹn SQL
Việc gọi lệnh xóa một Danh mục (Category) đang có Bài viết (Post) bên trong sẽ gây lỗi hệ thống (Foreign Key Constraint). **Cần xóa hết các bài viết liên kết trước khi xóa danh mục cha.**

---
<p align="center">
  <i>© 2026 AnhCMS_Solution - Full-Stack ASP.NET Core & ReactJS Documentation</i>
</p>
