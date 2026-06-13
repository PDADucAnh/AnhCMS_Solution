using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers
{
    public class CustomerController : Controller
    {
        private readonly ApplicationDbContext _context;

        // Constructor injection
        public CustomerController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Hiển thị danh sách khách hàng (không hiển thị mật khẩu)
        public IActionResult Index()
        {
            var customers = _context.Customers.ToList();
            return View(customers);
        }

        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Create(Customer model)
        {
            _context.Customers.Add(model);
            _context.SaveChanges();
            return RedirectToAction("Index");
        }

        public IActionResult Delete(int id)
        {
            var customer = _context.Customers.Find(id);
            if (customer != null)
            {
                _context.Customers.Remove(customer);
                _context.SaveChanges();
            }
            return RedirectToAction("Index");
        }

        [HttpGet]
        public IActionResult Edit(int id)
        {
            var customer = _context.Customers.Find(id);
            if (customer == null) return NotFound();
            return View(customer);
        }

        [HttpPost]
        public IActionResult Edit(Customer model)
        {
            _context.Customers.Update(model);
            _context.SaveChanges();
            return RedirectToAction("Index");
        }
    }
}