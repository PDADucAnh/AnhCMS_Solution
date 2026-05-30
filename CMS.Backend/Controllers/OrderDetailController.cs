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