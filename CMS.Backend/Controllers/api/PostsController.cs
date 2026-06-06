/*
    Họ tên: Phạm Đức Anh
    Mã SV: 2123110135
    Ngày tạo: 06/06/2026
    Mô tả:    1. Truy vấn dữ liệu LINQ Posts Controller
              2. Tạo API CRUD để quản lý bài viết
              3. Sử dụng Entity Framework để kết nối và thao tác với cơ sở dữ liệu SQL Server
 */
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using CMS.Data.Entities;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CMS.Backend.Controllers.api
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PostsController(ApplicationDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// GET: Lấy tất cả bài viết
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                // Không Include Category để tránh circular reference trong Swagger
                var posts = await _context.Posts
                    .AsNoTracking()
                    .OrderByDescending(p => p.CreatedDate)
                    .Select(p => new
                    {
                        p.Id,
                        p.Title,
                        p.Content,
                        p.ImageUrl,
                        p.CreatedDate,
                        p.CategoryId
                    })
                    .ToListAsync();

                return Ok(new
                {
                    success = true,
                    message = "Lấy danh sách bài viết thành công",
                    data = posts,
                    count = posts.Count
                });
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Lỗi kết nối cơ sở dữ liệu",
                    detail = ex.Message
                });
            }
        }

        /// <summary>
        /// GET: Lấy bài viết theo danh mục
        /// </summary>
        [HttpGet("category/{categoryId}")]
        public async Task<IActionResult> GetByCategory(int categoryId)
        {
            try
            {
                var posts = await _context.Posts
                    .AsNoTracking()
                    .Where(p => p.CategoryId == categoryId)
                    .OrderByDescending(p => p.CreatedDate)
                    .Select(p => new
                    {
                        p.Id,
                        p.Title,
                        p.Content,
                        p.ImageUrl,
                        p.CreatedDate,
                        p.CategoryId
                    })
                    .ToListAsync();

                return Ok(new
                {
                    success = true,
                    message = "Lấy bài viết theo danh mục thành công",
                    data = posts,
                    count = posts.Count
                });
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Lỗi khi lấy bài viết",
                    detail = ex.Message
                });
            }
        }

        /// <summary>
        /// GET: Lấy chi tiết một bài viết theo ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var post = await _context.Posts
                    .AsNoTracking()
                    .FirstOrDefaultAsync(p => p.Id == id);

                if (post == null)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "Bài viết không tồn tại"
                    });
                }

                return Ok(new
                {
                    success = true,
                    message = "Lấy thông tin bài viết thành công",
                    data = post
                });
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Lỗi khi lấy thông tin bài viết",
                    detail = ex.Message
                });
            }
        }

        /// <summary>
        /// POST: Thêm bài viết mới
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Post model)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Kiểm tra danh mục tồn tại
                var categoryExists = await _context.Categories
                    .AnyAsync(c => c.Id == model.CategoryId);

                if (!categoryExists)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "Danh mục không tồn tại"
                    });
                }

                model.CreatedDate = System.DateTime.Now;
                _context.Posts.Add(model);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    success = true,
                    message = "Thêm bài viết thành công",
                    data = model
                });
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Lỗi khi thêm bài viết",
                    detail = ex.Message
                });
            }
        }

        /// <summary>
        /// PUT: Cập nhật bài viết
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Post model)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var post = await _context.Posts.FindAsync(id);

                if (post == null)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "Bài viết không tồn tại"
                    });
                }

                // Kiểm tra danh mục nếu thay đổi
                if (model.CategoryId != post.CategoryId)
                {
                    var categoryExists = await _context.Categories
                        .AnyAsync(c => c.Id == model.CategoryId);

                    if (!categoryExists)
                    {
                        return BadRequest(new
                        {
                            success = false,
                            message = "Danh mục không tồn tại"
                        });
                    }
                }

                post.Title = model.Title;
                post.Content = model.Content;
                post.ImageUrl = model.ImageUrl;
                post.CategoryId = model.CategoryId;

                _context.Posts.Update(post);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    success = true,
                    message = "Cập nhật bài viết thành công",
                    data = post
                });
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Lỗi khi cập nhật bài viết",
                    detail = ex.Message
                });
            }
        }

        /// <summary>
        /// DELETE: Xóa bài viết
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var post = await _context.Posts.FindAsync(id);

                if (post == null)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "Bài viết không tồn tại"
                    });
                }

                _context.Posts.Remove(post);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    success = true,
                    message = "Xóa bài viết thành công",
                    data = new { id = post.Id }
                });
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Lỗi khi xóa bài viết",
                    detail = ex.Message
                });
            }
        }
    }
}
