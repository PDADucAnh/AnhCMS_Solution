/* Họ tên: Phạm Đức Anh
 * Mã SV: 2123110135
 * Lớp: CCQ2311D
 * Ngày tạo: 04/06/2026
 * Mô tả: 1.tạo dữ liệu DbSQLServer cho User Controller
 *        2. Tạo trang admin hiển thị danh sách thành viên, có chức năng thêm, sửa, xóa thành viên
 *        3. Thiết kế giao diện quản lý thành viên (CRUD) trong UserController
 *        4. Sử dụng Entity Framework để kết nối và thao tác với cơ sở dữ liệu SQL Server trong UserController
 *        5. Áp dụng phân quyền truy cập cho các chức năng quản lý thành viên trong UserController (chỉ Admin mới được phép xóa, Editor chỉ được phép xem và sửa) trong UserController
 *        6. Xử lý bảo mật: Không hiển thị mật khẩu trong danh sách thành viên, và có chức năng đổi mật khẩu riêng biệt trong UserController
 */

using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers
{
    [Authorize(Roles = "Admin")] // Chỉ tài khoản có Role là Admin mới được phép vào
    public class UserController : Controller
    {
        private readonly ApplicationDbContext _context;

        // Constructor injection
        public UserController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Hiển thị danh sách thành viên (không hiển thị mật khẩu)
        public IActionResult Index()
        {
            var users = _context.Users.ToList(); // Lấy tất cả user
            return View(users);
        }

        // GET: User/Create
        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Create(User model)
        {
            // Kiểm tra xem tên đăng nhập đã tồn tại chưa
            var checkExist = _context.Users.Any(u => u.Username == model.Username);
            if (checkExist)
            {
                ModelState.AddModelError("Username", "Tên đăng nhập này đã có người dùng!");
                return View(model);
            }

            // Lưu User mới vào Database
            _context.Users.Add(model);
            _context.SaveChanges();

            return RedirectToAction("Index");
        }

        // GET: Hiển thị form kèm dữ liệu cũ của User
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var user = _context.Users.Find(id);
            if (user == null) return NotFound();

            return View(user);
        }

        // POST: Thực hiện lưu thay đổi
        [HttpPost]
        public IActionResult Edit(User model, string NewPassword)
        {
            // 1. Tìm User gốc trong Database để lấy lại mật khẩu cũ nếu cần
            var existingUser = _context.Users.AsNoTracking().FirstOrDefault(u => u.Id == model.Id);

            if (existingUser == null) return NotFound();

            // 2. Xử lý mật khẩu: Nếu nhập mới thì lấy cái mới, nếu trống thì lấy cái cũ
            if (!string.IsNullOrEmpty(NewPassword))
            {
                model.PasswordHash = NewPassword; // Sau này sẽ mã hóa tại đây
            }
            else
            {
                model.PasswordHash = existingUser.PasswordHash;
            }

            // 3. Cập nhật vào Database
            _context.Users.Update(model);
            _context.SaveChanges();

            return RedirectToAction("Index");
        }

        public IActionResult Delete(int id)
        {
            var user = _context.Users.Find(id);
            if (user != null)
            {
                _context.Users.Remove(user);
                _context.SaveChanges();
            }
            return RedirectToAction("Index");
        }

        private bool UserExists(int id)
        {
            return _context.Users.Any(e => e.Id == id);
        }
    }
}
