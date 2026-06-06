/*
    Họ tên: Phạm Đức Anh
    Mã SV: 2123110135
    Ngày tạo: 06/06/2026
    Mô tả:    1. Truy vấn dữ liệu LINQ Customers Controller
              2. Tạo API CRUD để quản lý khách hàng
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
    public class CustomersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CustomersController(ApplicationDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// GET: Lấy tất cả khách hàng
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var customers = await _context.Customers
                    .OrderByDescending(c => c.Id)
                    .Select(c => new
                    {
                        c.Id,
                        c.FullName,
                        c.Email,
                        c.Phone,
                        c.Address
                    })
                    .ToListAsync();

                return Ok(new
                {
                    success = true,
                    message = "Lấy danh sách khách hàng thành công",
                    data = customers,
                    count = customers.Count
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
        /// GET: Lấy chi tiết một khách hàng theo ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var customer = await _context.Customers
                    .Include(c => c.Orders)
                    .FirstOrDefaultAsync(c => c.Id == id);

                if (customer == null)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "Khách hàng không tồn tại"
                    });
                }

                return Ok(new
                {
                    success = true,
                    message = "Lấy thông tin khách hàng thành công",
                    data = new
                    {
                        customer.Id,
                        customer.FullName,
                        customer.Email,
                        customer.Phone,
                        customer.Address,
                        OrderCount = customer.Orders?.Count ?? 0
                    }
                });
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Lỗi khi lấy thông tin khách hàng",
                    detail = ex.Message
                });
            }
        }

        /// <summary>
        /// POST: Thêm khách hàng mới
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Customer model)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Kiểm tra email đã tồn tại
                var existingCustomer = await _context.Customers
                    .FirstOrDefaultAsync(c => c.Email == model.Email);

                if (existingCustomer != null)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "Email đã được đăng ký"
                    });
                }

                _context.Customers.Add(model);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    success = true,
                    message = "Thêm khách hàng thành công",
                    data = new
                    {
                        model.Id,
                        model.FullName,
                        model.Email
                    }
                });
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Lỗi khi thêm khách hàng",
                    detail = ex.Message
                });
            }
        }

        /// <summary>
        /// PUT: Cập nhật thông tin khách hàng
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Customer model)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var customer = await _context.Customers.FindAsync(id);

                if (customer == null)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "Khách hàng không tồn tại"
                    });
                }

                // Kiểm tra email đã tồn tại (ngoại trừ khách hàng hiện tại)
                if (model.Email != customer.Email)
                {
                    var existingCustomer = await _context.Customers
                        .FirstOrDefaultAsync(c => c.Email == model.Email && c.Id != id);

                    if (existingCustomer != null)
                    {
                        return BadRequest(new
                        {
                            success = false,
                            message = "Email đã được đăng ký"
                        });
                    }
                }

                customer.FullName = model.FullName;
                customer.Email = model.Email;
                customer.Phone = model.Phone;
                customer.Address = model.Address;

                _context.Customers.Update(customer);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    success = true,
                    message = "Cập nhật thông tin khách hàng thành công",
                    data = new
                    {
                        customer.Id,
                        customer.FullName,
                        customer.Email,
                        customer.Phone,
                        customer.Address
                    }
                });
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Lỗi khi cập nhật khách hàng",
                    detail = ex.Message
                });
            }
        }

        /// <summary>
        /// DELETE: Xóa khách hàng
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var customer = await _context.Customers.FindAsync(id);

                if (customer == null)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "Khách hàng không tồn tại"
                    });
                }

                // Kiểm tra xem khách hàng có đơn hàng không
                var ordersCount = await _context.Orders
                    .CountAsync(o => o.CustomerId == id);

                if (ordersCount > 0)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = $"Không thể xóa khách hàng vì có {ordersCount} đơn hàng liên kết"
                    });
                }

                _context.Customers.Remove(customer);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    success = true,
                    message = "Xóa khách hàng thành công",
                    data = new { id = customer.Id }
                });
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Lỗi khi xóa khách hàng",
                    detail = ex.Message
                });
            }
        }
    }
}
