/* Họ tên: Phạm Đức Anh
 * Mã SV: 2123110135
 * Lớp: CCQ2311D
 * Ngày tạo: 30/05/2026
 * Mô tả: tạo dữ liệu test Post Controller
 */
/* Tạo dữ liệu mẫu trong SQLServer
-- 1. Bật tính năng chèn giá trị thủ công vào cột Id của bảng Categories
SET IDENTITY_INSERT Categories ON;

-- 2. Chèn tiếp các danh mục từ mã số 2 đến số 4 kèm trường Description bắt buộc
INSERT INTO Categories (Id, Name, Description) VALUES 
(2, N'Thời trang', N'Xu hướng và phong cách thời trang'),
(3, N'Sức khỏe', N'Mẹo và thói quen sống khỏe'),
(4, N'Du lịch', N'Cẩm nang và địa điểm du lịch');

-- 3. Chèn dữ liệu vào bảng Posts
INSERT INTO Posts (Title, Content, ImageUrl, CreatedDate, CategoryId) VALUES
(N'Lợi ích của AI trong giáo dục', N'Khám phá cách Trí tuệ nhân tạo thay đổi cách họ...', N'/img/ai-edu.jpg', '2026-04-01 00:00:00.0000000', 1),
(N'5 thói quen tốt cho sức khỏe', N'Uống đủ nước và tập thể dục mỗi ngày giúp bạn...', N'/img/suc-khoe-001.jpg', '2026-04-02 00:00:00.0000000', 3),
(N'Ứng dụng Blockchain trong tài chính', N'Khám phá cách công nghệ sổ cái phi tập trung thay đổi bảo mật...', N'/img/blockchain-finance.jpg', '2026-04-03 08:30:00.0000000', 1),
(N'Bí quyết nấu ăn ngon mỗi ngày', N'Hướng dẫn chi tiết các bước chuẩn bị bữa cơm gia đình dinh dưỡng...', N'/img/cooking-tips.jpg', '2026-04-04 11:15:00.0000000', 3),
(N'Xu hướng thời trang mùa hè 2026', N'Điểm qua những phong cách thiết kế và màu sắc lên ngôi năm nay...', N'/img/summer-fashion.jpg', '2026-04-05 14:20:00.0000000', 2),
(N'Học lập trình Python cho người mới', N'Lộ trình tự học Python từ cơ bản đến nâng cao cực kỳ dễ hiểu...', N'/img/learn-python.jpg', '2026-04-06 09:00:00.0000000', 1),
(N'Tác hại của việc thức khuya liên tục', N'Những cảnh báo khoa học về tác động tiêu cực đến hệ thần kinh...', N'/img/sleep-deprivation.jpg', '2026-04-07 22:45:00.0000000', 3),
(N'Cẩm nang du lịch Sa Pa tự túc', N'Chia sẻ kinh nghiệm di chuyển, ăn uống và check-in địa điểm đẹp...', N'/img/sapa-travel.jpg', '2026-04-08 07:10:00.0000000', 4),
(N'Trí tuệ nhân tạo tạo sinh là gì', N'Tìm hiểu về Generative AI và cách nó đang định hình tương lai...', N'/img/generative-ai.jpg', '2026-04-09 16:35:00.0000000', 1),
(N'Bài tập Yoga giảm mỏi vai gáy', N'5 động tác đơn giản dành riêng cho dân văn phòng ngồi nhiều...', N'/img/yoga-office.jpg', '2026-04-10 06:20:00.0000000', 3);

select * from Posts
*/

using CMS.Data;
using CMS.Data.Entities;// Kết nối tới lớp dữ liệu vừa tạo
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers
{
    public class PostController : Controller
    {
        private readonly ApplicationDbContext _context;
        // Constructor injection - tiêm DbContext
        public PostController(ApplicationDbContext context)
        {
            _context = context;
        }
        public IActionResult Index()
        {
            // 1.Lấy tất cả bài viết, bao gồm thông tin Category (nếu muốn hiển thị tên danh mục)
            var posts = _context.Posts
                .Include(p => p.Category)   // eager loading để dùng Category.Name trong View
                .ToList();
            // 2. Gửi danh sách dữ liệu sang View
            return View(posts);
        }

        // Hàm Details: Hiển thị chi tiết một bài viết (Bổ sung  khá giỏi)
        public IActionResult Details(int id)
        {
            // Giả lập tìm bài viết trong Database bằng Id
            // Trong thực tế tuần sau sẽ là: _context.Posts.Find(id);
            var post = new Post
            {
                Id = id,
                Title = "Nội dung chi tiết bài viết số " + id,
                Content = "Đây là nội dung đầy đủ của bài viết mà bạn vừa click vào. Ở đây  có thể viết dài hơn để thấy sự khác biệt với trang danh sách.",
                ImageUrl = "https://via.placeholder.com/600x300", // Ảnh to hơn
                CreatedDate = DateTime.Now
            };

            if (post == null) return NotFound();

            return View(post);
        }
    }
}
