using CMS.Backend.Services.Interfaces;
using CMS.Backend.Models.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Threading.Tasks;

namespace CMS.Backend.Controllers.Api
{
    [Authorize(Policy = "StaffOnly")]
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly IProductService _productService;
        private readonly INotificationService _notificationService;

        public ProductsController(IProductService productService, INotificationService notificationService)
        {
            _productService = productService;
            _notificationService = notificationService;
        }

        [AllowAnonymous]
        [HttpGet("paged")]
        public async Task<IActionResult> GetPaged([FromQuery] int page = 1, [FromQuery] int pageSize = 8, [FromQuery] string? currency = null, [FromQuery] string? locale = "en")
        {
            var result = await _productService.GetPaged(page, pageSize, locale);
            if (!string.IsNullOrEmpty(currency) && currency.ToUpper() != "USD")
            {
                result.Items = (await _productService.ToCurrency(result.Items, currency)).ToList();
            }
            return Ok(result);
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] string? currency, [FromQuery] string? locale = "en")
        {
            var products = await _productService.GetAll(locale);
            var result = await _productService.ToCurrency(products, currency);
            return Ok(result);
        }

        [AllowAnonymous]
        [HttpGet("categoryproduct/{categoryProductId}")]
        public async Task<IActionResult> GetByCategoryProduct(int categoryProductId, [FromQuery] string? currency, [FromQuery] string? locale = "en")
        {
            var products = await _productService.GetByCategoryProduct(categoryProductId, locale);
            var result = await _productService.ToCurrency(products, currency);
            return Ok(result);
        }

        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetDetail(int id, [FromQuery] string? currency, [FromQuery] string? locale = "en")
        {
            var product = await _productService.GetDetail(id, locale);

            if (product == null)
            {
                return NotFound(new { message = "Không tìm thấy sản phẩm này trong hệ thống" });
            }

            var result = await _productService.ToCurrency(product, currency);
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateProductDTO dto, [FromQuery] string? locale = "en")
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var created = await _productService.Create(dto, locale);
            await _notificationService.NotifyEntityChanged("Product");
            return CreatedAtAction(nameof(GetDetail), new { id = created.Id }, created);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateProductDTO dto)
        {
            if (id != dto.Id)
                return BadRequest();

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var updated = await _productService.Update(id, dto);

            if (!updated)
                return NotFound();

            await _notificationService.NotifyEntityChanged("Product");
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _productService.Delete(id);

            if (!deleted)
                return NotFound();

            await _notificationService.NotifyEntityChanged("Product");
            return NoContent();
        }
    }
}
