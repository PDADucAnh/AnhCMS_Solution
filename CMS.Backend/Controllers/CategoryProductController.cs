using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers
{
    [Authorize]
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
            // BƯỚC 1: Thêm dữ liệu vào bộ nhớ tạm của Entity Framework
            _context.CategoriesProducts.Add(model);

            // BƯỚC 2: Ra lệnh cho hệ thống ghi dữ liệu thật sự vào SQL Server
            _context.SaveChanges();

            // Sau khi lưu thành công, tự động quay về trang danh sách
            return RedirectToAction("Index");
        }

        // Action nhận vào Id của danh mục cần xóa
        public IActionResult Delete(int id)
        {
            // Bước 1: Tìm đối tượng danh mục trong Database bằng Id
            var category = _context.CategoriesProducts.Find(id);

            // Kiểm tra nếu tìm thấy thì mới xóa
            if (category != null)
            {
                // Bước 2: Lệnh xóa khỏi bộ nhớ tạm (Tracking)
                _context.CategoriesProducts.Remove(category);

                // Bước 3: Chốt phiên làm việc, xóa thực sự trong SQL Server
                _context.SaveChanges();
            }

            // Sau khi xóa xong, quay lại trang danh sách để cập nhật giao diện
            return RedirectToAction("Index");
        }

        // 1. Hàm GET: Tìm dữ liệu cũ và đổ lên Form
        [HttpGet]
        public IActionResult Edit(int id)
        {
            // Tìm danh mục trong Database theo Id
            var category = _context.CategoriesProducts.Find(id);

            if (category == null) return NotFound();

            return View(category); // Gửi đối tượng tìm được sang giao diện Edit
        }

        // 2. Hàm POST: Nhận dữ liệu mới từ người dùng và lưu lại
        [HttpPost]
        public IActionResult Edit(CategoryProduct model)
        {
            // Lệnh cập nhật đối tượng vào bộ nhớ tạm
            _context.CategoriesProducts.Update(model);

            // Lưu thay đổi thực sự xuống SQL Server 
            _context.SaveChanges();

            // Quay lại trang danh sách để xem kết quả
            return RedirectToAction("Index");
        }
    }
}