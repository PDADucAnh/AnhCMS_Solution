/*
    Tên: Phạm Đức Anh
    Mã SV: 2123110135
    Ngày tạo: 06/06/2026
    Mô tả:    1. Truy vấn dữ liệu LINQ OrderDetail Controller
              2. Tạo trang admin hiển thị danh sách chi tiết đơn hàng
              3. Thiết kế giao diện quản lý chi tiết đơn hàng (CRUD) trong OrderDetailController
              4. Sử dụng Entity Framework để kết nối và thao tác với cơ sở dữ liệu SQL Server trong OrderDetailController
              5. Áp dụng phân quyền truy cập cho các chức năng quản lý chi tiết đơn hàng trong OrderDetailController (chỉ Admin mới được phép xóa, Editor chỉ được phép xem và sửa) trong OrderDetailController
 */
using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers
{
    public class OrderDetailController : Controller
    {
        private readonly ApplicationDbContext _context;

        // Constructor injection
        public OrderDetailController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Hiển thị danh sách chi tiết đơn hàng (kèm thông tin Order và Product)
        public IActionResult Index()
        {
            var orderDetails = _context.OrderDetails
                .Include(od => od.Order)
                    .ThenInclude(o => o.Customer)   // Lấy tên khách hàng qua Order
                .Include(od => od.Product)
                    .ThenInclude(p => p.CategoryProduct) // Lấy tên danh mục sản phẩm (nếu muốn)
                .ToList();
            return View(orderDetails);
        }
    }
}