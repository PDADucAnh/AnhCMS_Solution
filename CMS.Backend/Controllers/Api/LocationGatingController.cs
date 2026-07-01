using CMS.Backend.Models.DTOs;
using CMS.Backend.Services;
using CMS.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CMS.Backend.Controllers.Api
{
    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymous]
    public class LocationGatingController : ControllerBase
    {
        private readonly IApplicationDbContext _context;
        private readonly StockLockService _stockLockService;

        private static readonly HashSet<string> SupportedDistricts = new()
        {
            "Quận 1", "Quận 3", "Quận 4", "Quận 5", "Quận 6", "Quận 7", "Quận 8", "Quận 10", "Quận 11", "Quận 12",
            "Quận Bình Thạnh", "Quận Gò Vấp", "Quận Phú Nhuận", "Quận Tân Bình", "Quận Tân Phú", "Quận Bình Tân",
            "Thành phố Thủ Đức"
        };

        public LocationGatingController(IApplicationDbContext context, StockLockService stockLockService)
        {
            _context = context;
            _stockLockService = stockLockService;
        }

        [HttpPost("check-availability")]
        public async Task<IActionResult> CheckAvailability([FromBody] CheckAvailabilityRequest request)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            if (!SupportedDistricts.Contains(request.District))
            {
                return Ok(new AvailabilityResponse
                {
                    Available = false,
                    Message = "Cửa hàng hiện chưa hỗ trợ giao hoa tới Quận/Huyện này. Vui lòng chọn khu vực khác."
                });
            }

            foreach (var item in request.Items)
            {
                var product = await _context.Products.FindAsync(item.ProductId);
                if (product == null) return NotFound(new { message = $"Không tìm thấy sản phẩm với Id {item.ProductId}" });

                int reserved = _stockLockService.GetReservedStock(item.ProductId);
                int availableStock = product.StockQuantity - reserved;

                if (availableStock < item.Quantity)
                {
                    return Ok(new AvailabilityResponse
                    {
                        Available = false,
                        Message = $"Sản phẩm '{product.Name}' hiện không đủ số lượng (còn {availableStock} sản phẩm khả dụng)."
                    });
                }
            }

            return Ok(new AvailabilityResponse { Available = true, Message = "Sẵn sàng giao hoa!" });
        }
    }
}
