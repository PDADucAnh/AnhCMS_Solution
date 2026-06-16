/* Họ tên: Phạm Đức Anh
 * Mã SV: 2123110135
 * Lớp: CCQ2311D
 * Ngày tạo: 05/06/2026
 * Mô tả: 1. Tạo dữ liệu test Category Controller
 *        2. Thiết kế giao diện quản lý danh mục sản phẩm (CRUD) trong CategoryController
 *        3. Sử dụng Entity Framework để kết nối và thao tác với cơ sở dữ liệu SQL Server trong CategoryController
 *        4. Áp dụng phân quyền truy cập cho các chức năng quản lý danh mục trong CategoryController (chỉ Admin mới được phép xóa, Editor chỉ được phép xem và sửa) trong CategoryController
 */

using CMS.Data.Entities;
using CMS.Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace CMS.Backend.Controllers
{
    [Authorize]
    public class CategoryController : Controller
    {
        private readonly ICategoryService _categoryService;

        // "Tiêm" Service vào Controller
        public CategoryController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        public async Task<IActionResult> Index()
        {
            // Lấy dữ liệu từ Service
            var data = await _categoryService.GetAll();
            return View(data);
        }

        public async Task<IActionResult> Details(int id)
        {
            var category = await _categoryService.GetById(id);

            if (category == null) return NotFound();

            return View(category);
        }

        // 1. Hàm GET: Dùng để hiển thị giao diện Form cho nhập
        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        // 2. Hàm POST: Dùng để đón dữ liệu từ Form gửi lên và lưu vào SQL
        [HttpPost]
        public async Task<IActionResult> Create(Category model)
        {
            await _categoryService.Create(model);
            return RedirectToAction("Index");
        }

        // Action nhận vào Id của danh mục cần xóa
        public async Task<IActionResult> Delete(int id)
        {
            await _categoryService.Delete(id);
            return RedirectToAction("Index");
        }

        // 1. Hàm GET: Tìm dữ liệu cũ và đổ lên Form
        [HttpGet]
        public async Task<IActionResult> Edit(int id)
        {
            var category = await _categoryService.GetById(id);

            if (category == null) return NotFound();

            return View(category); // Gửi đối tượng tìm được sang giao diện Edit
        }

        // 2. Hàm POST: Nhận dữ liệu mới từ người dùng và lưu lại
        [HttpPost]
        public async Task<IActionResult> Edit(Category model)
        {
            await _categoryService.Update(model.Id, model);
            return RedirectToAction("Index");
        }
    }
}
