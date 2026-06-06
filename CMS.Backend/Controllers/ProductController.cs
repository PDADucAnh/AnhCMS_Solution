/* Họ tên: Phạm Đức Anh
 * Mã SV: 2123110135
 * Lớp: CCQ2311D
 * Ngày tạo: 05/06/2026
 * Mô tả: 1. Tạo dữ liệu test Product Controller
 *        2. Thiết kế giao diện quản lý sản phẩm (CRUD) trong ProductController
 *        3. Sử dụng Entity Framework để kết nối và thao tác với cơ sở dữ liệu SQL Server trong ProductController
 *        4. Áp dụng phân quyền truy cập cho các chức năng quản lý sản phẩm trong ProductController (chỉ Admin mới được phép xóa, Editor chỉ được phép xem và sửa) trong ProductController
 */

using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers
{
    [Authorize]
    public class ProductController : Controller
    {
        private readonly ApplicationDbContext _context;

        // "Tiêm" kết nối vào Controller
        public ProductController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Hiển thị danh sách sản phẩm (kèm tên danh mục)
        public IActionResult Index()
        {
            // Lấy dữ liệu THẬT từ bảng Products trong SQL (kèm thông tin danh mục)
            var data = _context.Products
                .Include(p => p.CategoryProduct)   // Lấy thêm thông tin danh mục
                .ToList();
            return View(data);
        }

        // 1. Hàm GET: Dùng để hiển thị giao diện Form cho nhập liệu
        [HttpGet]
        public IActionResult Create()
        {
            // Lấy danh sách danh mục để dropdown
            ViewBag.Categories = _context.CategoriesProducts.ToList();
            return View();
        }

        // 2. Hàm POST: Dùng để đón dữ liệu từ Form gửi lên và lưu vào SQL
        [HttpPost]
        public IActionResult Create(Product model)
        {
            // Kiểm tra dữ liệu hợp lệ
            if (!ModelState.IsValid)
            {
                ViewBag.Categories = _context.CategoriesProducts.ToList();
                return View(model);
            }

            // Kiểm tra danh mục tồn tại
            var categoryExists = _context.CategoriesProducts
                .Any(c => c.Id == model.CategoryProductId);

            if (!categoryExists)
            {
                ModelState.AddModelError("CategoryProductId", "Danh mục sản phẩm không tồn tại");
                ViewBag.Categories = _context.CategoriesProducts.ToList();
                return View(model);
            }

            // BƯỚC 1: Thêm dữ liệu vào bộ nhớ tạm của Entity Framework
            _context.Products.Add(model);

            // BƯỚC 2: Ra lệnh cho hệ thống ghi dữ liệu thật sự vào SQL Server
            _context.SaveChanges();

            // Sau khi lưu thành công, tự động quay về trang danh sách
            return RedirectToAction("Index");
        }

        // Action nhận vào Id của sản phẩm cần xóa (chỉ Admin)
        [Authorize(Roles = "Admin")]
        public IActionResult Delete(int id)
        {
            // Bước 1: Tìm đối tượng sản phẩm trong Database bằng Id
            var product = _context.Products.Find(id);

            // Kiểm tra nếu tìm thấy thì mới xóa
            if (product != null)
            {
                // Bước 2: Lệnh xóa khỏi bộ nhớ tạm (Tracking)
                _context.Products.Remove(product);

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
            // Tìm sản phẩm trong Database theo Id
            var product = _context.Products.Find(id);

            if (product == null) return NotFound();

            // Lấy danh sách danh mục để dropdown
            ViewBag.Categories = _context.CategoriesProducts.ToList();

            return View(product); // Gửi đối tượng tìm được sang giao diện Edit
        }

        // 2. Hàm POST: Nhận dữ liệu mới từ người dùng và lưu lại
        [HttpPost]
        public IActionResult Edit(Product model)
        {
            // Kiểm tra dữ liệu hợp lệ
            if (!ModelState.IsValid)
            {
                ViewBag.Categories = _context.CategoriesProducts.ToList();
                return View(model);
            }

            // Kiểm tra danh mục tồn tại
            var categoryExists = _context.CategoriesProducts
                .Any(c => c.Id == model.CategoryProductId);

            if (!categoryExists)
            {
                ModelState.AddModelError("CategoryProductId", "Danh mục sản phẩm không tồn tại");
                ViewBag.Categories = _context.CategoriesProducts.ToList();
                return View(model);
            }

            // Lệnh cập nhật đối tượng vào bộ nhớ tạm
            _context.Products.Update(model);

            // Lưu thay đổi thực sự xuống SQL Server 
            _context.SaveChanges();

            // Quay lại trang danh sách để xem kết quả
            return RedirectToAction("Index");
        }

        // Xem chi tiết sản phẩm
        public IActionResult Details(int id)
        {
            var product = _context.Products
                .Include(p => p.CategoryProduct)
                .FirstOrDefault(p => p.Id == id);

            if (product == null) return NotFound();

            return View(product);
        }
    }
}