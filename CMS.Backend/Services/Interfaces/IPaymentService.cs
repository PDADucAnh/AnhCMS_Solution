using CMS.Backend.Models.DTOs;
using CMS.Data.Entities;
using System.Threading.Tasks;

namespace CMS.Backend.Services.Interfaces
{
    public interface IPaymentService
    {
        Task<PaymentDTO> RecordPayment(int orderId, decimal amount, PaymentMethod method, string? transactionId = null);
        Task<bool> ProcessWebhook(PaymentWebhookRequest request);
        Task<bool> RefundPayment(int orderId, decimal amount);
        Task<PaymentDTO?> GetByOrderId(int orderId);
    }
}
