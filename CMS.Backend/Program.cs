/* Họ tên: Phạm Đức Anh
 * Mã SV: 2123110135
 * Lớp: CCQ2311D
 * Ngày tạo: 06/06/2026
 * Mô tả:   1.Xác thức Authentication và phân quyền Authorization
 *          2. Cấu hình hệ thống để sử dụng Cookie Authentication trong ASP.NET Core
 *          3. Thiết lập các middleware cần thiết để bảo vệ các trang quản trị và đảm bảo chỉ người dùng đã đăng nhập mới có thể truy cập vào các chức năng quản lý trong CMS
 *          4. Tạo tài khoản người dùng với vai trò Admin và Editor để kiểm tra chức năng phân quyền trong hệ thống CMS
 *          5. Xử lý bảo mật: Không hiển thị mật khẩu trong danh sách thành viên, và có chức năng đổi mật khẩu riêng biệt trong UserController
 *          6. Áp dụng chính sách CORS để cho phép các ứng dụng frontend (ví dụ: React, Angular) có thể gọi API của hệ thống CMS một cách an toàn và hiệu quả
 *          7. Sử dụng Swagger để tạo tài liệu API tự động cho các endpoint trong hệ thống CMS, giúp cho việc phát triển và tích hợp với frontend trở nên dễ dàng hơn
 *          8. Tối ưu hiệu suất: Sử dụng các kỹ thuật như caching, pagination, và tối ưu hóa truy vấn để cải thiện hiệu suất của hệ thống CMS khi xử lý lượng lớn dữ liệu hoặc nhiều yêu cầu đồng thời
 */
using CMS.Backend.Models;
using CMS.Backend.Services;
using CMS.Backend.Services.Interfaces;
using CMS.Data;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);

var jwtSettings = builder.Configuration.GetSection("Jwt");
var secretKey = jwtSettings["SecretKey"]!;

builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.LoginPath = "/Account/Login";
        options.AccessDeniedPath = "/Account/AccessDenied";
    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings["Issuer"],
            ValidAudience = jwtSettings["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey))
        };
    });
builder.Services.AddControllersWithViews();

// Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<IApplicationDbContext>(provider => provider.GetRequiredService<ApplicationDbContext>());

builder.Services.AddScoped<CMS.Backend.Services.Interfaces.IPostService, CMS.Backend.Services.PostService>();
builder.Services.AddScoped<CMS.Backend.Services.Interfaces.IProductService, CMS.Backend.Services.ProductService>();
builder.Services.AddScoped<CMS.Backend.Services.Interfaces.ICategoryService, CMS.Backend.Services.CategoryService>();
builder.Services.AddScoped<CMS.Backend.Services.Interfaces.ICategoryProductService, CMS.Backend.Services.CategoryProductService>();
builder.Services.AddScoped<CMS.Backend.Services.Interfaces.IUserService, CMS.Backend.Services.UserService>();
builder.Services.AddScoped<CMS.Backend.Services.Interfaces.IAuthService, CMS.Backend.Services.AuthService>();
builder.Services.AddScoped<CMS.Backend.Services.Interfaces.ICustomerService, CMS.Backend.Services.CustomerService>();
builder.Services.AddScoped<CMS.Backend.Services.Interfaces.IOrderService, CMS.Backend.Services.OrderService>();
builder.Services.AddScoped<CMS.Backend.Services.Interfaces.IOrderDetailService, CMS.Backend.Services.OrderDetailService>();

// ---- CẤU HÌNH CORS (THÊM VÀO TRƯỚC builder.Build()) ----
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000") // Cho phép ReactJS ở port 3000 gọi tới
              .AllowAnyHeader()                     // Cho phép mọi loại Header (Content-Type, Authorization...)
              .AllowAnyMethod()                     // Cho phép mọi phương thức HTTP (GET, POST, PUT, DELETE)
              .AllowCredentials();                  // Hỗ trợ truyền Cookie/Session nếu cần sau này
    });
});

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy =>
        policy.RequireRole("Admin", "Administrator"));
    options.AddPolicy("StaffOnly", policy =>
        policy.RequireRole("Admin", "Administrator", "Editor"));
});

var app = builder.Build();


if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();
app.UseCors("AllowReactApp");

app.Use(async (context, next) =>
{
    if (context.Request.Path.StartsWithSegments("/api"))
    {
        try
        {
            await next();
        }
        catch (Exception)
        {
            context.Response.StatusCode = 500;
            context.Response.ContentType = "application/json";
            var error = new ApiErrorResponse
            {
                Code = "INTERNAL_ERROR",
                Message = "An internal error occurred"
            };
            await context.Response.WriteAsync(JsonSerializer.Serialize(error));
        }
    }
    else
    {
        await next();
    }
});

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();