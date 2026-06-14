using CMS.Data.Entities;
using CMS.Backend.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public OrdersController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] OrderInputDTO input)
        {
            if (input == null)
            {
                return BadRequest(new { message = "Dữ liệu đơn hàng không hợp lệ" });
            }

            var items = input.Items?.Select(i => new OrderItemInput
            {
                ProductId = i.ProductId,
                Quantity = i.Quantity,
                UnitPrice = i.UnitPrice
            }).ToList() ?? new List<OrderItemInput>();

            var (success, message, orderId) = await _orderService.CreateOrder(
                input.CustomerId, input.Notes, items);

            if (!success)
            {
                return StatusCode(500, new { message, detail = message });
            }

            return StatusCode(201, new
            {
                message,
                orderId
            });
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var orders = await _orderService.GetAll();
            return Ok(orders);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetDetail(int id)
        {
            var order = await _orderService.GetDetail(id);

            if (order == null)
                return NotFound();

            return Ok(order);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Order order)
        {
            if (id != order.Id)
                return BadRequest();

            var updated = await _orderService.Update(id, order);

            if (!updated)
                return NotFound();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _orderService.Delete(id);

            if (!deleted)
                return NotFound();

            return NoContent();
        }

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
