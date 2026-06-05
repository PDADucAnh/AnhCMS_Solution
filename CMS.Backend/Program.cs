/* Họ tên: Phạm Đức Anh
 * Mã SV: 2123110135
 * Lớp: CCQ2311D
 * Ngày tạo: 05/06/2026
 * Mô tả:   1.Xác thức Authentication và phân quyền Authorization
 *          2. Cấu hình hệ thống để sử dụng Cookie Authentication trong ASP.NET Core
 *          3. Thiết lập các middleware cần thiết để bảo vệ các trang quản trị và đảm bảo chỉ người dùng đã đăng nhập mới có thể truy cập vào các chức năng quản lý trong CMS
 *          4. Tạo tài khoản người dùng với vai trò Admin và Editor để kiểm tra chức năng phân quyền trong hệ thống CMS
 *          5. Xử lý bảo mật: Không hiển thị mật khẩu trong danh sách thành viên, và có chức năng đổi mật khẩu riêng biệt trong UserController
 *          
 */
using CMS.Data;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// 1. KHU VỰC ĐĂNG KÝ DỊCH VỤ (SERVICES CONTAINER)
builder.Services.AddControllersWithViews(); //Lệnh này vừa nhận diện các API mới, vừa giữ quyền biên dịch các View (.cshtml) của Web MVC cũ.

// Đăng ký dịch vụ lõi giúp hệ thống tự động bóc tách thông tin Endpoint phục vụ Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(); // -- Kích hoạt bộ sinh tài liệu API Swagger

// Đăng ký DbContext vào hệ thống
builder.Services.AddDbContext<ApplicationDbContext>(options =>options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// 1. Khai báo dịch vụ xác thực Cookie
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.LoginPath = "/Account/Login"; // Đường dẫn nếu chưa đăng nhập
        options.AccessDeniedPath = "/Account/AccessDenied"; // Đường dẫn nếu vào trang không được phép
    });

var app = builder.Build();

// ==============================================================
//  2. KHU VỰC CẤU HÌNH MIDDLEWARE (REQUEST PIPELINE)
// ==============================================================
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "ThaiCMS Web API v1");
    c.RoutePrefix = "swagger"; // -- Đường dẫn truy cập mặc định sẽ là /swagger
});

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();
// [VỊ TRÍ ĐẶT CORS]: Phải nằm ngay giữa UseRouting và app.UseAuthentication(); UseAuthorization();
app.UseCors("AllowAll");
// ===================================

app.UseAuthentication(); // BƯỚC A: Xác nhận "Anh là ai?" (Kiểm tra thẻ bài)
app.UseAuthorization();  // BƯỚC B: Xác nhận "Anh được làm gì?" (Kiểm tra quyền)
// ===============================================================
// 3. KHU VỰC ĐỊNH TUYẾN PHÂN LUỒNG (ROUTING MAP)
//  đặt sau dòng UseAuthorization();
// ===============================================================

// Phân luồng A: 
// Ánh xạ các Endpoint API tuân thủ theo cấu trúc [Route("api/[controller]")]
app.MapControllers();

// Phân luồng B: Giữ lại bản đồ đường đi mặc định cho trang giao diện Web MVC cũ
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
