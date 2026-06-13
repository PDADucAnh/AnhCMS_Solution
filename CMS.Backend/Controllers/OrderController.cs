using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
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

        [HttpGet]
        public IActionResult Create()
        {
            ViewBag.CustomerList = new SelectList(_context.Customers, "Id", "FullName");
            return View();
        }

        [HttpPost]
        public IActionResult Create(Order model)
        {
            _context.Orders.Add(model);
            _context.SaveChanges();
            return RedirectToAction("Index");
        }

        public IActionResult Delete(int id)
        {
            var order = _context.Orders.Find(id);
            if (order != null)
            {
                _context.Orders.Remove(order);
                _context.SaveChanges();
            }
            return RedirectToAction("Index");
        }

        [HttpGet]
        public IActionResult Edit(int id)
        {
            var order = _context.Orders.Find(id);
            if (order == null) return NotFound();
            ViewBag.CustomerList = new SelectList(_context.Customers, "Id", "FullName", order.CustomerId);
            return View(order);
        }

        public IActionResult Details(int id)
        {
            var order = _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.OrderDetails)
                    .ThenInclude(od => od.Product)
                .FirstOrDefault(o => o.Id == id);

            if (order == null) return NotFound();
            return View(order);
        }

        [HttpPost]
        public IActionResult Edit(Order model)
        {
            _context.Orders.Update(model);
            _context.SaveChanges();
            return RedirectToAction("Index");
        }
    }
}