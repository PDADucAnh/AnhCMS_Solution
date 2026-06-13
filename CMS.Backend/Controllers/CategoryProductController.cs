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

        // 1. Hàm GET: Dùng để hiển thị giao diện Form cho nhập
        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        // 2. Hàm POST: Dùng để đón dữ liệu từ Form gửi lên và lưu vào SQL
        [HttpPost]
        public IActionResult Create(CategoryProduct model)
        {
            _context.CategoriesProducts.Add(model);
            _context.SaveChanges();
            return RedirectToAction("Index");
        }

        // Action nhận vào Id của danh mục cần xóa
        public IActionResult Delete(int id)
        {
            var category = _context.CategoriesProducts.Find(id);
            if (category != null)
            {
                _context.CategoriesProducts.Remove(category);
                _context.SaveChanges();
            }
            return RedirectToAction("Index");
        }

        // 1. Hàm GET: Tìm dữ liệu cũ và đổ lên Form
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var category = _context.CategoriesProducts.Find(id);
            if (category == null) return NotFound();
            return View(category);
        }

        // 2. Hàm POST: Nhận dữ liệu mới từ người dùng và lưu lại
        [HttpPost]
        public IActionResult Edit(CategoryProduct model)
        {
            _context.CategoriesProducts.Update(model);
            _context.SaveChanges();
            return RedirectToAction("Index");
        }
    }
}