using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers
{
    public class ProductController : Controller
    {
        private readonly ApplicationDbContext _context;

        // Constructor injection - tiêm DbContext
        public ProductController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Hiển thị danh sách sản phẩm (kèm tên danh mục)
        public IActionResult Index()
        {
            var products = _context.Products
                .Include(p => p.CategoryProduct)   // Lấy thêm thông tin danh mục
                .ToList();
            return View(products);
        }
    }
}