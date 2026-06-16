using CMS.Data.Entities;
using CMS.Backend.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace CMS.Backend.Controllers
{
    public class CategoryProductController : Controller
    {
        private readonly ICategoryProductService _categoryProductService;

        // Constructor injection - tiêm Service
        public CategoryProductController(ICategoryProductService categoryProductService)
        {
            _categoryProductService = categoryProductService;
        }

        // Hiển thị danh sách danh mục sản phẩm
        public async Task<IActionResult> Index()
        {
            var categories = await _categoryProductService.GetCategoriesProductsAsync();
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
        public async Task<IActionResult> Create(CategoryProduct model)
        {
            await _categoryProductService.Create(model);
            return RedirectToAction("Index");
        }

        // Action nhận vào Id của danh mục cần xóa
        public async Task<IActionResult> Delete(int id)
        {
            await _categoryProductService.Delete(id);
            return RedirectToAction("Index");
        }

        // 1. Hàm GET: Tìm dữ liệu cũ và đổ lên Form
        [HttpGet]
        public async Task<IActionResult> Edit(int id)
        {
            var category = await _categoryProductService.GetById(id);
            if (category == null) return NotFound();
            return View(category);
        }

        // 2. Hàm POST: Nhận dữ liệu mới từ người dùng và lưu lại
        [HttpPost]
        public async Task<IActionResult> Edit(CategoryProduct model)
        {
            await _categoryProductService.Update(model.Id, model);
            return RedirectToAction("Index");
        }
    }
}