using CMS.Backend.Models.DTOs;
using CMS.Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace CMS.Backend.Controllers.Api
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private readonly IPaymentService _paymentService;
        private readonly IOrderService _orderService;

        public PaymentController(IPaymentService paymentService, IOrderService orderService)
        {
            _paymentService = paymentService;
            _orderService = orderService;
        }

        [HttpPost("webhook")]
        public async Task<IActionResult> Webhook([FromBody] PaymentWebhookRequest request)
        {
            var result = await _paymentService.ProcessWebhook(request);
            if (!result)
                return BadRequest(new { message = "Xử lý webhook thất bại" });

            return Ok(new { message = "Cập nhật thanh toán thành công" });
        }

        [HttpPost("{orderId}/verify")]
        public async Task<IActionResult> VerifyCOD(int orderId, [FromBody] VerificationRequest request)
        {
            if (request.Otp != "000000")
                return BadRequest(new { message = "Mã OTP không hợp lệ" });

            var (success, message) = await _orderService.ProcessCODOrder(orderId);

            if (!success)
                return BadRequest(new { message });

            return Ok(new { message });
        }
    }
}
