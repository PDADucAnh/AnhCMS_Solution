using CMS.Data.Entities;

namespace CMS.Backend.Services.Interfaces
{
    public class OrderItemInput
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
    }

    public interface IOrderService
    {
        Task<IEnumerable<Order>> GetAll();
        Task<Order?> GetDetail(int id);
        Task<(bool Success, string Message, int OrderId)> CreateOrder(int customerId, string? notes, List<OrderItemInput> items);
        Task<bool> Update(int id, Order order);
        Task<bool> Delete(int id);
    }
}
