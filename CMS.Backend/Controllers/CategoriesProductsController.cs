/*
    Họ tên: Phạm Đức Anh
    Mã SV: 2123110135
    Ngày tạo: 06/06/2026
    Mô tả:    1. Truy vấn dữ liệu LINQ CategoryProducts Controller
              2. Tạo trang admin hiển thị danh sách danh mục sản phẩm
              3. Thiết kế giao diện quản lý danh mục sản phẩm (CRUD) trong CategoryProductsController
              4. Sử dụng Entity Framework để kết nối và thao tác với cơ sở dữ liệu SQL Server trong CategoryProductsController
 */
using CMS.Data;
using Microsoft.AspNetCore.Mvc;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryProductsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CategoryProductsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var categories = _context.CategoriesProducts
                .OrderByDescending(x => x.Id)
                .Select(x => new
                {
                    x.Id,
                    x.Name,
                    x.Description
                })
                .ToList();

            return Ok(categories);
        }

        [HttpGet("{id}")]
        public IActionResult GetDetail(int id)
        {
            var category = _context.CategoriesProducts
                .FirstOrDefault(x => x.Id == id);

            if (category == null)
                return NotFound(new { message = "Không tìm thấy danh mục" });

            return Ok(category);
        }
    }
}