/*
    Họ tên: Phạm Đức Anh
    Mã SV: 2123110135
    Ngày tạo: 06/06/2026
    Mô tả:    1. Truy vấn dữ liệu LINQ Categories Controller
              2. Tạo API CRUD để quản lý danh mục bài viết
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
    public class CategoriesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CategoriesController(ApplicationDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// GET: Lấy tất cả danh mục bài viết
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var categories = await _context.Categories
                    .OrderByDescending(c => c.Id)
                    .ToListAsync();

                return Ok(new
                {
                    success = true,
                    message = "Lấy danh sách danh mục thành công",
                    data = categories,
                    count = categories.Count
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
        /// GET: Lấy chi tiết một danh mục theo ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var category = await _context.Categories
                    .AsNoTracking()
                    .FirstOrDefaultAsync(c => c.Id == id);

                if (category == null)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "Danh mục không tồn tại"
                    });
                }

                return Ok(new
                {
                    success = true,
                    message = "Lấy thông tin danh mục thành công",
                    data = category
                });
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Lỗi khi lấy thông tin danh mục",
                    detail = ex.Message
                });
            }
        }

        /// <summary>
        /// POST: Thêm danh mục mới
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Category model)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                _context.Categories.Add(model);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    success = true,
                    message = "Thêm danh mục thành công",
                    data = model
                });
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Lỗi khi thêm danh mục",
                    detail = ex.Message
                });
            }
        }

        /// <summary>
        /// PUT: Cập nhật danh mục
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Category model)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var category = await _context.Categories.FindAsync(id);

                if (category == null)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "Danh mục không tồn tại"
                    });
                }

                category.Name = model.Name;
                category.Description = model.Description;

                _context.Categories.Update(category);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    success = true,
                    message = "Cập nhật danh mục thành công",
                    data = category
                });
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Lỗi khi cập nhật danh mục",
                    detail = ex.Message
                });
            }
        }

        /// <summary>
        /// DELETE: Xóa danh mục
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var category = await _context.Categories.FindAsync(id);

                if (category == null)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "Danh mục không tồn tại"
                    });
                }

                // Kiểm tra xem danh mục có bài viết không
                var postsCount = await _context.Posts
                    .CountAsync(p => p.CategoryId == id);

                if (postsCount > 0)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = $"Không thể xóa danh mục vì có {postsCount} bài viết liên kết"
                    });
                }

                _context.Categories.Remove(category);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    success = true,
                    message = "Xóa danh mục thành công",
                    data = new { id = category.Id }
                });
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Lỗi khi xóa danh mục",
                    detail = ex.Message
                });
            }
        }
    }
}
