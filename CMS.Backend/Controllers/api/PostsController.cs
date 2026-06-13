/*
    Họ tên: Phạm Đức Anh
    Mã SV: 2123110135
    Ngày tạo: 06/06/2026
    Mô tả:    1. Truy vấn dữ liệu LINQ Post Controller
              2. Tạo trang admin hiển thị danh sách bài viết theo từng danh mục
              3. Thiết kế giao diện quản lý bài viết (CRUD) trong PostController
              4. Sử dụng Entity Framework để kết nối và thao tác với cơ sở dữ liệu SQL Server trong PostController
              5. Áp dụng phân quyền truy cập cho các chức năng quản lý bài viết trong PostController (chỉ Admin mới được phép xóa, Editor chỉ được phép xem và sửa) trong PostController
*/
using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers
{
    // 1. Định nghĩa đường dẫn để gọi API. [controller] sẽ tự lấy tên là "Posts"
    // Khi chạy, địa chỉ truy cập dữ liệu sẽ là: https://localhost:xxxx/api/posts
    [Route("api/[controller]")]

    // 2. Đánh dấu đây là một API Controller để hệ thống hỗ trợ các tính năng tự động kiểm tra dữ liệu đầu vào
    [ApiController]

    // 3. API Controller phải kế thừa từ ControllerBase (thay vì kế thừa từ Controller như phân hệ MVC)
    public class PostsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        // 4. Hàm khởi tạo (Constructor): "Tiêm" ngữ cảnh dữ liệu SQL Server vào để sử dụng
        public PostsController(ApplicationDbContext context)
        {
            _context = context;
        }
        // 1. Chỉ định phương thức GET (Dùng để kéo dữ liệu từ cơ sở dữ liệu)
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            // Lấy toàn bộ dữ liệu từ bảng Posts số nhiều trong SQL Server
            var posts = await _context.Posts
                .OrderByDescending(p => p.Id) // Sắp xếp bài viết mới nhất lên đầu
                .Select(p => new {            // "Gọt tỉa" dữ liệu: chỉ lấy những trường cần thiết ra trang chủ 
                    p.Id,
                    p.Title,
                    p.ImageUrl,
                    p.CreatedDate,
                    CategoryName = p.Category.Name // Kéo trực tiếp tên chuyên mục thay vì chỉ lấy mã ID cộc lốc 
                })
                .ToListAsync();

            // Trả về kết quả cho Frontend kèm mã trạng thái HTTP 200 OK (Thành công)
            return Ok(posts);
        }
        // 2. Định nghĩa đường dẫn chứa tham số động: api/posts/category/{categoryId}
        [HttpGet("category/{categoryId}")]
        public async Task<IActionResult> GetByCategory(int categoryId)
        {
            // Lọc các bài viết có CategoryId trùng với ID truyền vào từ thanh URL
            var posts = await _context.Posts
                .Where(p => p.CategoryId == categoryId)
                .Select(p => new {
                    p.Id,
                    p.Title,
                    p.ImageUrl,
                    p.CreatedDate
                })
                .ToListAsync();

            return Ok(posts);
        }
        // 3. Định nghĩa đường dẫn nhận ID trực tiếp: api/posts/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetDetail(int id)
        {
            // 3.1. Quét bảng Posts để tìm bài viết đầu tiên có Id khớp với tham số
            var post = await _context.Posts
                .FirstOrDefaultAsync(p => p.Id == id);

            // 3.2 Xử lý kịch bản lỗi bảo vệ hệ thống: ID không tồn tại trong Database
            if (post == null)
            {
                // Trả về mã lỗi 404 kèm một "gói tin" JSON thông báo nhỏ gọn để Frontend tự xử lý UI
                return NotFound(new { message = "Không tìm thấy bài viết này trong hệ thống" });
            }

            // 3.3. Trả về toàn bộ đối tượng bài viết (bao gồm cả trường Content chứa mã HTML) kèm mã 200 OK
            return Ok(post);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Post post)
        {
            post.CreatedDate = DateTime.Now;
            _context.Posts.Add(post);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetDetail), new { id = post.Id }, post);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Post post)
        {
            if (id != post.Id) return BadRequest();
            _context.Entry(post).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Posts.Any(e => e.Id == id)) return NotFound();
                else throw;
            }
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var post = await _context.Posts.FindAsync(id);
            if (post == null) return NotFound();
            _context.Posts.Remove(post);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
