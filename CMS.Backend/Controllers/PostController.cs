/* Họ tên: Phạm Đức Anh
 * Mã SV: 2123110135
 * Lớp: CCQ2311D
 * Ngày tạo: 04/06/2026
 * Mô tả: 1.Truy vấn dữ liệu LINQ Post Controller
          2. Tạo trang admin hiển thị danh sách bài viết theo từng danh mục  
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
using Microsoft.AspNetCore.Mvc.Rendering;
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
        public IActionResult Index(int? id)
        {
            // 1. Kiểm tra nếu không có id truyền vào thì trả về lỗi hoặc toàn bộ bài viết
            if (id == null)
            {
                return BadRequest("Vui lòng cung cấp mã danh mục.");
            }

            // 2. Sử dụng LINQ với tham số 'id' linh hoạt
            var posts = _context.Posts
                        .Where(p => p.CategoryId == id)
                        .OrderByDescending(p => p.CreatedDate)
                        .Include(p => p.Category)
                        .ToList();


            // 3. Truyền dữ liệu ra View
            return View(posts);
        }

        // Hàm Details: Hiển thị chi tiết một bài viết (Bổ sung  khá giỏi)
        // GET: Post/Details/5
        public IActionResult Details(int id)
        {
            // 1. Truy vấn bài viết theo ID
            // Sử dụng .Include(p => p.Category) để lấy kèm thông tin Danh mục (Join bảng)
            var post = _context.Posts
                .Include(p => p.Category)
                .FirstOrDefault(p => p.Id == id);

            // 2. Kiểm tra nếu không tìm thấy bài viết (tránh lỗi màn hình trắng)
            if (post == null)
            {
                return NotFound(); // Trả về trang lỗi 404
            }

            // 3. Truyền dữ liệu sang View
            return View(post);
        }
        // 1. Hàm hiển thị form tạo mới bài viết (GET)
        [HttpGet]
        public IActionResult Create()
        {
            // Chúng ta lấy danh sách Category để đổ vào ViewBag
            ViewBag.CategoryList = new SelectList(_context.Categories, "Id", "Name");
            return View();
        }



        [HttpPost]
        public IActionResult Create(Post model, IFormFile uploadImage)
        {
            if (uploadImage != null && uploadImage.Length > 0)
            {
                // 1. Định nghĩa đường dẫn lưu file: wwwroot/uploads
                string folder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");

                // Tạo thư mục nếu chưa tồn tại
                if (!Directory.Exists(folder)) Directory.CreateDirectory(folder);

                // 2. Tạo tên file duy nhất để không bị đè dữ liệu
                string fileName = Guid.NewGuid().ToString() + Path.GetExtension(uploadImage.FileName);
                string filePath = Path.Combine(folder, fileName);

                // 3. Chép file vào thư mục
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    uploadImage.CopyTo(stream);
                }

                // 4. Lưu đường dẫn vào CSDL để sau này hiển thị
                model.ImageUrl = "/uploads/" + fileName;
            }

            _context.Posts.Add(model);
            _context.SaveChanges();
            return RedirectToAction("Index");
        }
        public IActionResult Delete(int id)
        {
            // 1. Tìm bài viết theo Id
            var post = _context.Posts.Find(id);

            if (post != null)
            {
                // 2. Xóa khỏi bộ nhớ tạm
                _context.Posts.Remove(post);

                // 3. Cập nhật xuống SQL Server
                _context.SaveChanges();
            }
            return RedirectToAction("Index");
        }
        // GET: Hiển thị form kèm dữ liệu cũ
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var post = _context.Posts.Find(id);
            if (post == null) return NotFound();

            // Chuẩn bị lại danh sách danh mục để người dùng có thể đổi chuyên mục
            ViewBag.CategoryList = new SelectList(_context.Categories, "Id", "Name", post.CategoryId);
            return View(post);
        }

        // POST: Thực hiện cập nhật
        [HttpPost]
        public IActionResult Edit(Post model, IFormFile uploadImage)
        {
            // Bước 1: Kiểm tra xem người dùng có chọn file ảnh mới không
            if (uploadImage != null && uploadImage.Length > 0)
            {
                // Thực hiện quy trình upload giống như trang Create
                string folder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
                if (!Directory.Exists(folder)) Directory.CreateDirectory(folder);

                string fileName = Guid.NewGuid().ToString() + Path.GetExtension(uploadImage.FileName);
                string filePath = Path.Combine(folder, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    uploadImage.CopyTo(stream);
                }

                // Cập nhật đường dẫn ảnh mới vào model
                model.ImageUrl = "/uploads/" + fileName;
            }
            else
            {
                // Bước quan trọng: Nếu không upload ảnh mới, chúng ta phải giữ lại ảnh cũ
                // Chúng ta cần lấy lại giá trị ImageUrl từ Database để tránh bị ghi đè thành rỗng
                var oldPost = _context.Posts.AsNoTracking().FirstOrDefault(p => p.Id == model.Id);
                if (oldPost != null && string.IsNullOrEmpty(model.ImageUrl))
                {
                    model.ImageUrl = oldPost.ImageUrl;
                }
            }
            _context.Posts.Update(model);
            _context.SaveChanges();
            return RedirectToAction("Index");
        }

    }
}
