using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers
{
    public class OrderController : Controller
    {
        private readonly ApplicationDbContext _context;

        // Constructor injection
        public OrderController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Hiển thị danh sách đơn hàng (kèm tên khách hàng)
        public IActionResult Index()
        {
            var orders = _context.Orders
                .Include(o => o.Customer)   // Lấy thông tin khách hàng
                .ToList();
            return View(orders);
        }
    }
}