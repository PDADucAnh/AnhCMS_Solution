/*
    Tên: Phạm Đức Anh
    Mã SV: 2123110135
    Ngày tạo: 06/06/2026
    Mô tả:    1. Truy vấn dữ liệu LINQ Orders Controller
              2. Tạo trang admin hiển thị danh sách đơn đặt hàng
              3. Thiết kế giao diện quản lý đơn đặt hàng (CRUD) trong OrdersController
              4. Sử dụng Entity Framework để kết nối và thao tác với cơ sở dữ liệu SQL Server trong OrdersController
              5. Áp dụng phân quyền truy cập cho các chức năng quản lý đơn đặt hàng trong OrdersController (chỉ Admin mới được phép xóa, Editor chỉ được phép xem và sửa) trong OrdersController
 */
using System;
using System.Threading.Tasks;
using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public OrdersController(ApplicationDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// API: Tiếp nhận đơn đặt hàng từ giỏ hàng FrontEnd gửi lên
        /// Đường dẫn: POST https://localhost:xxxx/api/Orders
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] OrderInputDTO input)
        {
            // 1. Kiểm tra kịch bản lỗi bảo vệ: Nếu dữ liệu truyền lên trống rỗng
            if (input == null)
            {
                return BadRequest(new { message = "Dữ liệu đơn hàng không hợp lệ" });
            }

            try
            {
                // Bước A: Tự động khởi tạo cấu trúc thực thể Đơn hàng mới
                var newOrder = new Order
                {
                    OrderDate = DateTime.Now,
                    CustomerId = input.CustomerId,
                    Status = 0,
                    Notes = input.Notes
                };

                // Thêm OrderDetails nếu có
                if (input.Items != null && input.Items.Count > 0)
                {
                    newOrder.OrderDetails = input.Items.Select(item => new OrderDetail
                    {
                        ProductId = item.ProductId,
                        Quantity = item.Quantity,
                        UnitPrice = item.UnitPrice
                    }).ToList();
                }

                // Bước B: Thêm vào bảng tạm và chốt lưu xuống SQL Server
                _context.Orders.Add(newOrder);
                await _context.SaveChangesAsync(); 

                // Bước C: Trả về mã thành công 201 Created và gửi ngược lại mã ID đơn hàng vừa tạo
                return StatusCode(201, new
                {
                    message = "Đặt hàng thành công!",
                    orderId = newOrder.Id
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi xử lý tạo đơn hàng ngầm", detail = ex.Message });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var orders = await _context.Orders
                .Include(o => o.Customer)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();
            return Ok(orders);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetDetail(int id)
        {
            var order = await _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.OrderDetails)
                    .ThenInclude(od => od.Product)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null) return NotFound();
            return Ok(order);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Order order)
        {
            if (id != order.Id) return BadRequest();
            _context.Entry(order).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Orders.Any(e => e.Id == id)) return NotFound();
                else throw;
            }
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null) return NotFound();
            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // LỚP DTO TRUNG GIAN ĐỂ HỨNG DỮ LIỆU TỪ FRONTEND TRUYỀN LÊN
        public class OrderInputDTO
        {
            public int CustomerId { get; set; }
            public string Notes { get; set; }
            public List<OrderItemDTO> Items { get; set; }
        }

        public class OrderItemDTO
        {
            public int ProductId { get; set; }
            public int Quantity { get; set; }
            public decimal UnitPrice { get; set; }
        }
    }
}
