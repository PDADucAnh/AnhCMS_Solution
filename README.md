# AnhCMS Solution - ASP.NET Core CMS FullStack

![ASP.NET Core](https://img.shields.io/badge/ASP.NET%20Core-.NET%208-blue)
![CSharp](https://img.shields.io/badge/C%23-12.0-purple)
![SQL Server](https://img.shields.io/badge/Database-SQL%20Server-red)
![ReactJS](https://img.shields.io/badge/Frontend-ReactJS-61DAFB)
![Status](https://img.shields.io/badge/Status-Development-success)

---

# 📌 Giới thiệu dự án

**AnhCMS Solution** là dự án xây dựng hệ thống **CMS FullStack** bằng công nghệ **ASP.NET Core MVC + ReactJS + SQL Server**.

Dự án được thực hiện nhằm:
- Xây dựng hệ thống quản lý nội dung (CMS)
- Quản lý bài viết, danh mục, sản phẩm và đơn hàng
- Làm quen mô hình kiến trúc 3 lớp chuyên nghiệp
- Thực hành Entity Framework Core và Migration
- Kết nối Backend ASP.NET Core với Frontend ReactJS

---

# 👨‍🎓 Thông tin sinh viên

| Thông tin | Chi tiết |
|---|---|
| 👤 Sinh viên | **Phạm Đức Anh** |
| 🆔 MSSV | **2123110135** |
| 🏫 Trường | **Cao Đẳng Công Thương** |
| 📚 Môn học | **Chuyên Đề ASP.NET** |
| 👨‍🏫 Giảng viên | **Thầy Nguyễn Cao Thái** |

---

# 🎯 Mục tiêu Chương 1

Sau khi hoàn thành chương 1, dự án đạt được:

- Thiết lập môi trường lập trình ASP.NET Core
- Hiểu cấu trúc Solution 3 lớp
- Tạo kiến trúc FullStack chuyên nghiệp
- Xây dựng các Entity đầu tiên
- Tạo Backend ASP.NET Core MVC
- Tạo Frontend ReactJS
- Hiển thị dữ liệu mẫu từ Backend ra giao diện

---

# 🏗 Kiến trúc hệ thống

```bash
AnhCMS_Solution
│
├── CMS.Data          # Lớp dữ liệu (Entities)
├── CMS.Backend       # ASP.NET Core MVC + API
└── CMS.Frontend      # ReactJS Frontend
```

---

# ⚙️ Công nghệ sử dụng

| Công nghệ | Mô tả |
|---|---|
| ASP.NET Core MVC | Backend Framework |
| Entity Framework Core | ORM quản lý dữ liệu |
| SQL Server | Hệ quản trị cơ sở dữ liệu |
| ReactJS | Frontend Framework |
| Visual Studio 2022 | IDE phát triển |
| NodeJS | Runtime cho ReactJS |
| Git & GitHub | Quản lý source code |

---

# 🖥 Yêu cầu môi trường

## 1. Visual Studio 2022

Cần cài đặt:
- ASP.NET and web development
- .NET desktop development

---

## 2. SQL Server & SSMS

Sử dụng:
- SQL Server Express
- SQL Server Management Studio (SSMS)

Kiểm tra kết nối:

```bash
(localdb)\MSSQLLocalDB
```

hoặc:

```bash
.\SQLEXPRESS
```

---

## 3. .NET SDK

Khuyến nghị:
- .NET 8.0 LTS

Kiểm tra phiên bản:

```bash
dotnet --version
```

---

## 4. NodeJS

Kiểm tra:

```bash
node -v
npm -v
```

---

# 📦 Cấu trúc Project

## 1. CMS.Data

Chứa:
- Entity Models
- Quan hệ dữ liệu
- Data Annotations

### Các Entity chính

| Entity | Chức năng |
|---|---|
| Category | Danh mục bài viết |
| Post | Bài viết |
| User | Người dùng quản trị |
| CategoryProduct | Danh mục sản phẩm |
| Product | Sản phẩm |
| Customer | Khách hàng |
| Order | Đơn hàng |
| OrderDetail | Chi tiết đơn hàng |

---

## 2. CMS.Backend

Chứa:
- ASP.NET Core MVC
- Controllers
- Views
- API xử lý dữ liệu

### Chức năng hiện tại
- Hiển thị danh sách Category
- Tạo dữ liệu mẫu
- Kết nối sang CMS.Data

---

## 3. CMS.Frontend

Chứa:
- ReactJS Frontend
- Giao diện người dùng
- Kết nối API Backend

---

# 🚀 Hướng dẫn khởi chạy dự án

# 1️⃣ Clone Source Code

```bash
git clone https://github.com/yourusername/AnhCMS_Solution.git
```

---

# 2️⃣ Mở Solution

Mở file:

```bash
AnhCMS_Solution.sln
```

---

# 3️⃣ Chạy Backend ASP.NET Core

Thiết lập:

```bash
CMS.Backend -> Set as Startup Project
```

Sau đó nhấn:

```bash
F5
```

Kết quả:
- Trình duyệt mở ASP.NET Core Welcome Page
- Backend chạy tại localhost

---

# 4️⃣ Chạy Frontend ReactJS

Mở terminal:

```bash
cd cms.frontend
```

Cài package:

```bash
npm install
```

Chạy ReactJS:

```bash
npm start
```

Hoặc:

```bash
npm run dev
```

---

# 📚 Nội dung đã thực hiện trong Chương 1

## ✅ Cài đặt môi trường ASP.NET Core

Đã cài đặt:
- Visual Studio 2022
- SQL Server
- SSMS
- .NET SDK
- NodeJS
- Git

---

## ✅ Xây dựng Solution 3 lớp

Bao gồm:
- Data Layer
- Backend Layer
- Frontend Layer

---

## ✅ Tạo Entity Models

Đã xây dựng:
- Category
- Post
- User
- Product
- Order
- Customer

---

## ✅ Tạo ASP.NET Core MVC Backend

Đã thực hiện:
- Controllers
- Razor Views
- MVC Routing
- Mock Data

---

## ✅ Tạo ReactJS Frontend

Đã thực hiện:
- Khởi tạo React App
- Kết nối Solution
- Chạy giao diện Frontend

---

## ✅ Demo dữ liệu đầu tiên

Đã hiển thị:
- Danh sách Category
- Dữ liệu mẫu từ Backend

---

# 🧠 Kiến thức đạt được

Sau chương 1:
- Hiểu cấu trúc ASP.NET Core
- Hiểu mô hình 3 lớp
- Hiểu Entity và Database Design
- Hiểu MVC Pattern
- Biết cách tạo Controller và View
- Biết cách kết nối Backend và Frontend

---

# 🔥 Tóm tắt nội dung Chương 2

## 📌 Chủ đề chính
### Entity Framework Core & Migration

---

# 🎯 Mục tiêu Chương 2

- Thiết lập kết nối SQL Server
- Cấu hình DbContext
- Tạo Database tự động bằng Migration
- Quản lý dữ liệu bằng Entity Framework Core
- Thay thế dữ liệu giả bằng dữ liệu thật từ Database

---

# ⚙️ Nội dung sẽ thực hiện

## 1. Cài đặt EF Core Packages

Cài:
```bash
Microsoft.EntityFrameworkCore
Microsoft.EntityFrameworkCore.SqlServer
Microsoft.EntityFrameworkCore.Tools
```

---

## 2. Tạo DbContext

Ví dụ:

```csharp
public class CMSDbContext : DbContext
{
    public CMSDbContext(DbContextOptions<CMSDbContext> options)
        : base(options)
    {
    }

    public DbSet<Category> Categories { get; set; }
    public DbSet<Post> Posts { get; set; }
}
```

---

## 3. Cấu hình Connection String

Trong:

```bash
appsettings.json
```

Ví dụ:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=.;Database=CMS_DB;Trusted_Connection=True;TrustServerCertificate=True"
}
```

---

## 4. Thực hiện Migration

Lệnh tạo migration:

```bash
Add-Migration InitialCreate
```

Cập nhật Database:

```bash
Update-Database
```

---

## 5. Tạo Database CMS_DB

Sau khi migration:
- SQL Server tự sinh database
- Tự sinh bảng
- Không cần viết SQL thủ công

---

## 6. CRUD dữ liệu thật

Thay vì Mock Data:
- Lấy dữ liệu từ SQL Server
- Thêm/Sửa/Xóa dữ liệu thực tế

---

# 📷 Demo dự kiến Chương 2

Sau chương 2 hệ thống sẽ:
- Có Database thật
- Có bảng dữ liệu thật
- Kết nối SQL Server thành công
- Hiển thị dữ liệu động

---

# 📖 Kiến thức trọng tâm

| Nội dung | Ý nghĩa |
|---|---|
| DbContext | Cầu nối giữa C# và Database |
| Migration | Quản lý thay đổi Database |
| EF Core | ORM thao tác dữ liệu |
| Connection String | Kết nối SQL Server |
| CRUD | Thao tác dữ liệu |

---

# 🧪 Công cụ hỗ trợ

| Công cụ | Chức năng |
|---|---|
| Postman | Test API |
| SSMS | Quản lý Database |
| GitHub | Lưu source code |
| JSON Viewer | Xem JSON đẹp hơn |

---

# 📌 Trạng thái dự án

| Module | Trạng thái |
|---|---|
| CMS.Data | ✅ Hoàn thành cơ bản |
| CMS.Backend | ✅ Đã chạy |
| CMS.Frontend | ✅ Đã khởi tạo |
| EF Core | 🔄 Chuẩn bị triển khai |
| Database | 🔄 Chuẩn bị tạo |
| API CRUD | 🔄 Đang phát triển |

---

# 📈 Định hướng phát triển

Các chức năng sẽ triển khai tiếp:
- Authentication & Authorization
- CRUD Product
- CRUD Category
- CRUD Post
- Upload hình ảnh
- RESTful API
- JWT Authentication
- Dashboard Admin
- Deploy Hosting

---

# 🤝 Đóng góp

Dự án phục vụ mục đích:
- Học tập
- Nghiên cứu ASP.NET Core
- Thực hành FullStack Development

---

# 📄 License

Project sử dụng cho mục đích học tập tại:
**Cao Đẳng Công Thương**

---

# ❤️ Lời cảm ơn

Xin chân thành cảm ơn:
- Thầy Nguyễn Cao Thái
- Khoa Công Nghệ Thông Tin
- Trường Cao Đẳng Công Thương

đã hỗ trợ và hướng dẫn trong quá trình thực hiện dự án.

---

# ⭐ Author

## Phạm Đức Anh
### MSSV: 2123110135
### ASP.NET Core FullStack Developer Student
