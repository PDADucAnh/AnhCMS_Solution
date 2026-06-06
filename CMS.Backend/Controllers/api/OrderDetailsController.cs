/*
    Họ tên: Phạm Đức Anh
    Mã SV: 2123110135
    Ngày tạo: 06/06/2026
    Mô tả:    1. Truy vấn dữ liệu LINQ OrderDetails Controller
              2. Tạo API CRUD để quản lý chi tiết đơn hàng
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
    public class OrderDetailsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public OrderDetailsController(ApplicationDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// GET: Lấy tất cả chi tiết đơn hàng
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var orderDetails = await _context.OrderDetails
                    .Include(od => od.Order)
                    .Include(od => od.Product)
                    .OrderByDescending(od => od.Id)
                    .ToListAsync();

                return Ok(new
                {
                    success = true,
                    message = "Lấy danh sách chi tiết đơn hàng thành công",
                    data = orderDetails,
                    count = orderDetails.Count
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
        /// GET: Lấy chi tiết đơn hàng theo OrderId
        /// </summary>
        [HttpGet("order/{orderId}")]
        public async Task<IActionResult> GetByOrderId(int orderId)
        {
            try
            {
                var orderDetails = await _context.OrderDetails
                    .Include(od => od.Product)
                    .Where(od => od.OrderId == orderId)
                    .ToListAsync();

                if (!orderDetails.Any())
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "Không tìm thấy chi tiết cho đơn hàng này"
                    });
                }

                return Ok(new
                {
                    success = true,
                    message = "Lấy chi tiết đơn hàng thành công",
                    data = orderDetails,
                    count = orderDetails.Count
                });
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Lỗi khi lấy chi tiết đơn hàng",
                    detail = ex.Message
                });
            }
        }

        /// <summary>
        /// GET: Lấy chi tiết một mục đơn hàng theo ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var orderDetail = await _context.OrderDetails
                    .Include(od => od.Order)
                    .Include(od => od.Product)
                    .FirstOrDefaultAsync(od => od.Id == id);

                if (orderDetail == null)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "Chi tiết đơn hàng không tồn tại"
                    });
                }

                return Ok(new
                {
                    success = true,
                    message = "Lấy thông tin chi tiết đơn hàng thành công",
                    data = orderDetail
                });
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Lỗi khi lấy thông tin chi tiết đơn hàng",
                    detail = ex.Message
                });
            }
        }

        /// <summary>
        /// POST: Thêm chi tiết đơn hàng mới
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] OrderDetail model)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Kiểm tra đơn hàng tồn tại
                var orderExists = await _context.Orders
                    .AnyAsync(o => o.Id == model.OrderId);

                if (!orderExists)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "Đơn hàng không tồn tại"
                    });
                }

                // Kiểm tra sản phẩm tồn tại
                var product = await _context.Products
                    .FirstOrDefaultAsync(p => p.Id == model.ProductId);

                if (product == null)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "Sản phẩm không tồn tại"
                    });
                }

                // Kiểm tra số lượng hợp lệ
                if (model.Quantity <= 0)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "Số lượng phải lớn hơn 0"
                    });
                }

                // Kiểm tra tồn kho
                if (product.StockQuantity < model.Quantity)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = $"Tồn kho không đủ. Chỉ còn {product.StockQuantity} sản phẩm"
                    });
                }

                _context.OrderDetails.Add(model);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    success = true,
                    message = "Thêm chi tiết đơn hàng thành công",
                    data = model
                });
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Lỗi khi thêm chi tiết đơn hàng",
                    detail = ex.Message
                });
            }
        }

        /// <summary>
        /// PUT: Cập nhật chi tiết đơn hàng
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] OrderDetail model)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var orderDetail = await _context.OrderDetails.FindAsync(id);

                if (orderDetail == null)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "Chi tiết đơn hàng không tồn tại"
                    });
                }

                // Kiểm tra số lượng hợp lệ
                if (model.Quantity <= 0)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "Số lượng phải lớn hơn 0"
                    });
                }

                // Nếu sản phẩm thay đổi, kiểm tra sản phẩm mới
                if (model.ProductId != orderDetail.ProductId)
                {
                    var product = await _context.Products
                        .FirstOrDefaultAsync(p => p.Id == model.ProductId);

                    if (product == null)
                    {
                        return BadRequest(new
                        {
                            success = false,
                            message = "Sản phẩm không tồn tại"
                        });
                    }

                    if (product.StockQuantity < model.Quantity)
                    {
                        return BadRequest(new
                        {
                            success = false,
                            message = $"Tồn kho không đủ. Chỉ còn {product.StockQuantity} sản phẩm"
                        });
                    }

                    orderDetail.ProductId = model.ProductId;
                }
                else
                {
                    // Kiểm tra tồn kho với sản phẩm hiện tại nếu số lượng tăng
                    var product = await _context.Products
                        .FirstOrDefaultAsync(p => p.Id == orderDetail.ProductId);

                    if (model.Quantity > orderDetail.Quantity)
                    {
                        int additionalQuantity = model.Quantity - orderDetail.Quantity;
                        if (product.StockQuantity < additionalQuantity)
                        {
                            return BadRequest(new
                            {
                                success = false,
                                message = $"Tồn kho không đủ. Chỉ còn {product.StockQuantity} sản phẩm"
                            });
                        }
                    }
                }

                orderDetail.Quantity = model.Quantity;
                orderDetail.UnitPrice = model.UnitPrice;

                _context.OrderDetails.Update(orderDetail);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    success = true,
                    message = "Cập nhật chi tiết đơn hàng thành công",
                    data = orderDetail
                });
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Lỗi khi cập nhật chi tiết đơn hàng",
                    detail = ex.Message
                });
            }
        }

        /// <summary>
        /// DELETE: Xóa chi tiết đơn hàng
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var orderDetail = await _context.OrderDetails.FindAsync(id);

                if (orderDetail == null)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "Chi tiết đơn hàng không tồn tại"
                    });
                }

                _context.OrderDetails.Remove(orderDetail);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    success = true,
                    message = "Xóa chi tiết đơn hàng thành công",
                    data = new { id = orderDetail.Id }
                });
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Lỗi khi xóa chi tiết đơn hàng",
                    detail = ex.Message
                });
            }
        }
    }
}
