using System;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;
using CMS.Backend.Models;
using CMS.Backend.Services.Interfaces;
using CMS.Data.Entities;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace CMS.Backend.Services
{
    public class EmailService : IEmailService
    {
        private readonly EmailSettings _settings;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IOptions<EmailSettings> settings, ILogger<EmailService> logger)
        {
            _settings = settings.Value;
            _logger = logger;
        }

        public async Task SendOrderConfirmationAsync(Order order, string customerEmail, string customerName)
        {
            try
            {
                var body = BuildOrderConfirmationBody(order, customerName);
                using var message = new MailMessage
                {
                    From = new MailAddress(_settings.SenderEmail, _settings.SenderName),
                    Subject = $"Xác nhận đơn hàng #{order.Id} - AnhCMS Boutique",
                    Body = body,
                    IsBodyHtml = true
                };
                message.To.Add(new MailAddress(customerEmail, customerName));

                using var client = new SmtpClient(_settings.SmtpHost, _settings.SmtpPort)
                {
                    EnableSsl = _settings.EnableSsl,
                    DeliveryMethod = SmtpDeliveryMethod.Network,
                    UseDefaultCredentials = true
                };

                await client.SendMailAsync(message);
                _logger.LogInformation("Order confirmation email sent for order {OrderId} to {Email}", order.Id, customerEmail);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to send order confirmation email for order {OrderId}", order.Id);
            }
        }

        private static string BuildOrderConfirmationBody(Order order, string customerName)
        {
            var sb = new StringBuilder();
            sb.AppendLine("<!DOCTYPE html><html><head><meta charset='utf-8'><style>");
            sb.AppendLine("body { font-family: 'Georgia', serif; background: #f5f2ed; color: #1a1a1a; padding: 40px 20px; }");
            sb.AppendLine(".container { max-width: 600px; margin: 0 auto; background: #fff; border: 1px solid #d4cfc7; }");
            sb.AppendLine(".header { background: #ab2c5d; color: #fff; padding: 30px; text-align: center; }");
            sb.AppendLine(".header h1 { margin: 0; font-size: 20px; letter-spacing: 2px; text-transform: uppercase; }");
            sb.AppendLine(".content { padding: 30px; }");
            sb.AppendLine(".order-id { font-size: 24px; font-weight: bold; color: #ab2c5d; margin: 10px 0; }");
            sb.AppendLine("table { width: 100%; border-collapse: collapse; margin: 20px 0; }");
            sb.AppendLine("th { background: #f5f2ed; padding: 10px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; }");
            sb.AppendLine("td { padding: 10px; border-bottom: 1px solid #e8e4dd; font-size: 14px; }");
            sb.AppendLine(".total { font-size: 18px; font-weight: bold; color: #ab2c5d; text-align: right; padding-top: 15px; }");
            sb.AppendLine(".footer { padding: 20px 30px; background: #f5f2ed; font-size: 12px; color: #666; text-align: center; }");
            sb.AppendLine("</style></head><body>");
            sb.AppendLine("<div class='container'>");
            sb.AppendLine("<div class='header'><h1>Xác nhận đơn hàng</h1></div>");
            sb.AppendLine("<div class='content'>");
            sb.AppendLine($"<p>Kính gửi {customerName},</p>");
            sb.AppendLine("<p>Cảm ơn bạn đã đặt hàng tại AnhCMS Boutique. Đơn hàng của bạn đã được ghi nhận và đang được xử lý.</p>");
            sb.AppendLine($"<div class='order-id'>Mã đơn hàng: #{order.Id}</div>");
            sb.AppendLine("<table><thead><tr><th>Sản phẩm</th><th>Số lượng</th><th>Đơn giá</th><th>Thành tiền</th></tr></thead><tbody>");

            if (order.OrderDetails != null)
            {
                foreach (var detail in order.OrderDetails)
                {
                    var productName = detail.Product?.Name ?? $"Sản phẩm #{detail.ProductId}";
                    var lineTotal = detail.Quantity * detail.UnitPrice;
                    sb.AppendLine($"<tr><td>{productName}</td><td>{detail.Quantity}</td><td>{detail.UnitPrice:N0}₫</td><td>{lineTotal:N0}₫</td></tr>");
                }
            }

            sb.AppendLine("</tbody></table>");
            var total = order.OrderDetails?.Sum(d => d.Quantity * d.UnitPrice) ?? 0;
            sb.AppendLine($"<div class='total'>Tổng cộng: {total:N0}₫</div>");
            sb.AppendLine("<p><strong>Phương thức thanh toán:</strong> Thanh toán khi nhận hàng (COD)</p>");
            sb.AppendLine("</div>");
            sb.AppendLine("<div class='footer'>");
            sb.AppendLine("<p>AnhCMS Boutique — Trân trọng cảm ơn quý khách!</p>");
            sb.AppendLine("<p>Mọi thắc mắc xin vui lòng liên hệ: support@anhcms.com</p>");
            sb.AppendLine("</div></div></body></html>");
            return sb.ToString();
        }
    }
}
