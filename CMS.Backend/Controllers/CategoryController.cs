/* Họ tên: Phạm Đức Anh
 * Mã SV: 2123110135
 * Lớp: CCQ2311D
 * Ngày tạo: 05/06/2026
 * Mô tả: 1. Tạo dữ liệu test Category Controller
 *        2. Thiết kế giao diện quản lý danh mục sản phẩm (CRUD) trong CategoryController
 *        3. Sử dụng Entity Framework để kết nối và thao tác với cơ sở dữ liệu SQL Server trong CategoryController
 *        4. Áp dụng phân quyền truy cập cho các chức năng quản lý danh mục trong CategoryController (chỉ Admin mới được phép xóa, Editor chỉ được phép xem và sửa) trong CategoryController
 */

using CMS.Data;
using CMS.Data.Entities;// Kết nối tới lớp dữ liệu vừa tạo
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CMS.Backend.Controllers
{
    [Authorize]
    public class CategoryController : Controller
    {
        private readonly ApplicationDbContext _context;

        // "Tiêm" kết nối vào Controller
        public CategoryController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            // Lấy dữ liệu THẬT từ bảng Categories trong SQL
            var data = _context.Categories.ToList();
            return View(data);
        }
        // 1. Hàm GET: Dùng để hiển thị giao diện Form cho  nhập
        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        // 2. Hàm POST: Dùng để đón dữ liệu từ Form gửi lên và lưu vào SQL
        [HttpPost]
        public IActionResult Create(Category model)
        {
            // BƯỚC 1: Thêm dữ liệu vào bộ nhớ tạm của Entity Framework
            _context.Categories.Add(model);

            // BƯỚC 2: Ra lệnh cho hệ thống ghi dữ liệu thật sự vào SQL Server
            _context.SaveChanges();

            // Sau khi lưu thành công, tự động quay về trang danh sách
            return RedirectToAction("Index");
        }
        // Action nhận vào Id của danh mục cần xóa
        public IActionResult Delete(int id)
        {
            // Bước 1: Tìm đối tượng danh mục trong Database bằng Id
            var category = _context.Categories.Find(id);

            // Kiểm tra nếu tìm thấy thì mới xóa
            if (category != null)
            {
                // Bước 2: Lệnh xóa khỏi bộ nhớ tạm (Tracking)
                _context.Categories.Remove(category);

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
            var category = _context.Categories.Find(id);

            if (category == null) return NotFound();

            return View(category); // Gửi đối tượng tìm được sang giao diện Edit
        }

        // 2. Hàm POST: Nhận dữ liệu mới từ người dùng và lưu lại
        [HttpPost]
        public IActionResult Edit(Category model)
        {
            // Lệnh cập nhật đối tượng vào bộ nhớ tạm
            _context.Categories.Update(model);

            // Lưu thay đổi thực sự xuống SQL Server 
            _context.SaveChanges();

            // Quay lại trang danh sách để xem kết quả
            return RedirectToAction("Index");
        }
    }
}
