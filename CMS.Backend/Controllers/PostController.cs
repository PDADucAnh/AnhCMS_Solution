/* Họ tên: Phạm Đức Anh
 * Mã SV: 2123110135
 * Lớp: CCQ2311D
 * Ngày tạo: 16/05/2026
 * Mô tả: tạo dữ liệu test Post Controller
 */


using CMS.Data.Entities;// Kết nối tới lớp dữ liệu vừa tạo
using Microsoft.AspNetCore.Mvc;

namespace CMS.Backend.Controllers
{
    public class PostController : Controller
    {
        public IActionResult Index()
        {
            //Tạo mẫu trực tiếp trong code
            var list = new List<Post>
            {
                new Post {Id = 1,Title="Khóa học ASP.NET",Content="Hướng dẫn lập trình web kết hợp ASP.NET",ImageUrl="#" },
                new Post{Id=2,Title="Khóa học AI Agent",Content="Hướng dẫn tạo AI Agent cá nhân",ImageUrl="#"}
            };

            return View(list);//Gửi danh sách này sang giao diện
        }
    }
}
