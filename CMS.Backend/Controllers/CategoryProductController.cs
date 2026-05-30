using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers
{
    public class CategoryProductController : Controller
    {
        private readonly ApplicationDbContext _context;

        // Constructor injection - tiêm DbContext
        public CategoryProductController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Hiển thị danh sách danh mục sản phẩm
        public IActionResult Index()
        {
            var categories = _context.CategoriesProducts.ToList();
            return View(categories);
        }
    }
}