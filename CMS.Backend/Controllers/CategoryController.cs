/* Họ tên: Phạm Đức Anh
 * Mã SV: 2123110135
 * Lớp: CCQ2311D
 * Ngày tạo: 16/05/2026
 * Mô tả: tạo dữ liệu test Category Controller
 */

using CMS.Data.Entities;// Kết nối tới lớp dữ liệu vừa tạo
using Microsoft.AspNetCore.Mvc;

namespace CMS.Backend.Controllers
{
    public class CategoryController : Controller
    {
        public IActionResult Index()
        {
            // Tạo danh sách dữ liệu mẫu trực tiếp trong code
            var list = new List<Category> {
            new Category { Id = 1, Name = "Tin Công Nghệ", Description = "Review Laptop, AI" },
            new Category { Id = 2, Name = "Giáo Dục", Description = "Thông tin tuyển sinh" }
        };

            return View(list);// Gửi danh sách này sang giao diện
        }
    }
}
