using CMS.Data;
using CMS.Data.Entities;
using CMS.Backend.Models.DTOs;
using CMS.Backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;

namespace CMS.Backend.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly IApplicationDbContext _context;
        private readonly IOrderService _orderService;

        public PaymentService(IApplicationDbContext context, IOrderService orderService)
        {
            _context = context;
            _orderService = orderService;
        }

        public async Task<PaymentDTO> RecordPayment(int orderId, decimal amount, PaymentMethod method, string? transactionId = null)
        {
            var payment = new Payment
            {
                OrderId = orderId,
                Amount = amount,
                Method = method,
                Status = PaymentStatus.Completed,
                TransactionId = transactionId,
                PaidAt = DateTime.Now
            };

            _context.Payments.Add(payment);

            var order = await _context.Orders.FindAsync(orderId);
            if (order != null)
            {
                order.PaymentStatus = PaymentStatus.Completed;
                order.PaymentTransactionId = transactionId;
                order.PaymentPaidAt = DateTime.Now;
                order.Status = OrderStatus.Confirmed;
            }

            await _context.SaveChangesAsync();
            return payment.ToDTO();
        }

        public async Task<bool> ProcessWebhook(PaymentWebhookRequest request)
        {
            var order = await _context.Orders.FindAsync(request.OrderId);
            if (order == null) return false;

            if (request.Status == "success" || request.Status == "completed")
            {
                await RecordPayment(request.OrderId, request.Amount, PaymentMethod.OnlinePayment, request.TransactionId);
                return true;
            }

            if (request.Status == "failed" || request.Status == "cancelled")
            {
                order.PaymentStatus = PaymentStatus.Failed;
                await _context.SaveChangesAsync();

                await _orderService.CancelWithReason(request.OrderId, "Thanh toán thất bại");

                var slot = await _context.DeliverySlots
                    .FirstOrDefaultAsync(s => s.Id == order.Id);
                if (slot != null && slot.CurrentBooked > 0)
                    slot.CurrentBooked--;

                await _context.SaveChangesAsync();
                return true;
            }

            return false;
        }

        public async Task<bool> RefundPayment(int orderId, decimal amount)
        {
            var payment = await _context.Payments
                .FirstOrDefaultAsync(p => p.OrderId == orderId && p.Status == PaymentStatus.Completed);

            if (payment == null) return false;

            payment.Status = amount >= payment.Amount ? PaymentStatus.Refunded : PaymentStatus.PartialRefund;
            payment.RefundedAt = DateTime.Now;

            var order = await _context.Orders.FindAsync(orderId);
            if (order != null)
            {
                order.RefundAmount = amount;
                order.PaymentStatus = amount >= payment.Amount ? PaymentStatus.Refunded : PaymentStatus.PartialRefund;
            }

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<PaymentDTO?> GetByOrderId(int orderId)
        {
            var payment = await _context.Payments
                .FirstOrDefaultAsync(p => p.OrderId == orderId);
            return payment?.ToDTO();
        }
    }
}
