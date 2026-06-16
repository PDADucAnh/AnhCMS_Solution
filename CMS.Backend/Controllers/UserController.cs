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

using CMS.Data.Entities;
using CMS.Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace CMS.Backend.Controllers
{
    [Authorize(Roles = "Admin")] // Chỉ tài khoản có Role là Admin mới được phép vào
    public class UserController : Controller
    {
        private readonly IUserService _userService;

        // Constructor injection
        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        // Hiển thị danh sách thành viên (không hiển thị mật khẩu)
        public async Task<IActionResult> Index()
        {
            var users = await _userService.GetUsersAsync(); // Lấy tất cả user thông qua Service
            return View(users);
        }

        // GET: User/Create
        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Create(User model)
        {
            // Kiểm tra xem tên đăng nhập đã tồn tại chưa
            var checkExist = await _userService.UserExistsAsync(model.Username);
            if (checkExist)
            {
                ModelState.AddModelError("Username", "Tên đăng nhập này đã có người dùng!");
                return View(model);
            }

            // Lưu User mới vào Database thông qua Service (tự động mã hóa mật khẩu)
            await _userService.CreateUserAsync(model);

            return RedirectToAction("Index");
        }

        // GET: Hiển thị form kèm dữ liệu cũ của User
        [HttpGet]
        public async Task<IActionResult> Edit(int id)
        {
            var user = await _userService.GetUserByIdAsync(id);
            if (user == null) return NotFound();

            return View(user);
        }

        // POST: Thực hiện lưu thay đổi
        [HttpPost]
        public async Task<IActionResult> Edit(User model, string NewPassword)
        {
            // Xử lý mật khẩu mới nếu được nhập
            if (!string.IsNullOrEmpty(NewPassword))
            {
                model.PasswordHash = NewPassword;
            }
            else
            {
                model.PasswordHash = null; // Sẽ giữ nguyên mật khẩu cũ trong Service.Update
            }

            // Cập nhật vào Database qua Service
            var success = await _userService.Update(model.Id, model);
            if (!success) return NotFound();

            return RedirectToAction("Index");
        }

        public async Task<IActionResult> Delete(int id)
        {
            await _userService.Delete(id);
            return RedirectToAction("Index");
        }
    }
}
