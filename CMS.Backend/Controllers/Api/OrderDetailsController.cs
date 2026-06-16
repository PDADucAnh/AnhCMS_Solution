using CMS.Backend.Services.Interfaces;
using CMS.Backend.Models.DTOs;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Threading.Tasks;

namespace CMS.Backend.Controllers.Api
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderDetailsController : ControllerBase
    {
        private readonly IOrderDetailService _orderDetailService;

        public OrderDetailsController(IOrderDetailService orderDetailService)
        {
            _orderDetailService = orderDetailService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var orderDetails = await _orderDetailService.GetAll();
            return Ok(orderDetails);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var orderDetail = await _orderDetailService.GetById(id);
            if (orderDetail == null)
                return NotFound();

            return Ok(orderDetail);
        }

        [HttpGet("order/{orderId}")]
        public async Task<IActionResult> GetByOrderId(int orderId)
        {
            var all = await _orderDetailService.GetAll();
            var orderDetails = all.Where(od => od.OrderId == orderId);
            return Ok(orderDetails);
        }

        [HttpPost]
        public async Task<IActionResult> Create(OrderDetailDTO dto)
        {
            var created = await _orderDetailService.Create(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, OrderDetailDTO dto)
        {
            if (id != dto.Id)
                return BadRequest();

            var updated = await _orderDetailService.Update(id, dto);

            if (!updated)
                return NotFound();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _orderDetailService.Delete(id);

            if (!deleted)
                return NotFound();

            return NoContent();
        }
    }
}
