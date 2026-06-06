/*
    Họ tên: Phạm Đức Anh
    Mã SV: 2123110135
    Ngày tạo: 06/06/2026
    Mô tả:    1. Truy vấn dữ liệu LINQ Users Controller
              2. Tạo API CRUD để quản lý người dùng (Admin, Editor)
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
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UsersController(ApplicationDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// GET: Lấy tất cả người dùng (không hiển thị mật khẩu)
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var users = await _context.Users
                    .OrderByDescending(u => u.Id)
                    .Select(u => new
                    {
                        u.Id,
                        u.Username,
                        u.FullName,
                        u.Role
                    })
                    .ToListAsync();

                return Ok(new
                {
                    success = true,
                    message = "Lấy danh sách người dùng thành công",
                    data = users,
                    count = users.Count
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
        /// GET: Lấy chi tiết một người dùng theo ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.Id == id);

                if (user == null)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "Người dùng không tồn tại"
                    });
                }

                return Ok(new
                {
                    success = true,
                    message = "Lấy thông tin người dùng thành công",
                    data = new
                    {
                        user.Id,
                        user.Username,
                        user.FullName,
                        user.Role
                    }
                });
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Lỗi khi lấy thông tin người dùng",
                    detail = ex.Message
                });
            }
        }

        /// <summary>
        /// POST: Thêm người dùng mới
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] User model)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Kiểm tra username đã tồn tại
                var existingUser = await _context.Users
                    .FirstOrDefaultAsync(u => u.Username == model.Username);

                if (existingUser != null)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "Username đã tồn tại"
                    });
                }

                // Kiểm tra role hợp lệ
                if (!new[] { "Admin", "Editor" }.Contains(model.Role))
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "Role phải là 'Admin' hoặc 'Editor'"
                    });
                }

                _context.Users.Add(model);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    success = true,
                    message = "Thêm người dùng thành công",
                    data = new
                    {
                        model.Id,
                        model.Username,
                        model.FullName,
                        model.Role
                    }
                });
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Lỗi khi thêm người dùng",
                    detail = ex.Message
                });
            }
        }

        /// <summary>
        /// PUT: Cập nhật thông tin người dùng
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] User model)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var user = await _context.Users.FindAsync(id);

                if (user == null)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "Người dùng không tồn tại"
                    });
                }

                // Kiểm tra username đã tồn tại (ngoại trừ người dùng hiện tại)
                if (model.Username != user.Username)
                {
                    var existingUser = await _context.Users
                        .FirstOrDefaultAsync(u => u.Username == model.Username && u.Id != id);

                    if (existingUser != null)
                    {
                        return BadRequest(new
                        {
                            success = false,
                            message = "Username đã tồn tại"
                        });
                    }
                }

                // Kiểm tra role hợp lệ
                if (!new[] { "Admin", "Editor" }.Contains(model.Role))
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "Role phải là 'Admin' hoặc 'Editor'"
                    });
                }

                user.Username = model.Username;
                user.FullName = model.FullName;
                user.Role = model.Role;

                _context.Users.Update(user);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    success = true,
                    message = "Cập nhật người dùng thành công",
                    data = new
                    {
                        user.Id,
                        user.Username,
                        user.FullName,
                        user.Role
                    }
                });
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Lỗi khi cập nhật người dùng",
                    detail = ex.Message
                });
            }
        }

        /// <summary>
        /// DELETE: Xóa người dùng
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var user = await _context.Users.FindAsync(id);

                if (user == null)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "Người dùng không tồn tại"
                    });
                }

                _context.Users.Remove(user);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    success = true,
                    message = "Xóa người dùng thành công",
                    data = new { id = user.Id }
                });
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Lỗi khi xóa người dùng",
                    detail = ex.Message
                });
            }
        }
    }
}
