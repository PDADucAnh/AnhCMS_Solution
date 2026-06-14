using CMS.Data.Entities;

namespace CMS.Backend.Services.Interfaces
{
    public interface IOrderDetailService
    {
        Task<IEnumerable<OrderDetail>> GetAll();
        Task<OrderDetail?> GetById(int id);
        Task<IEnumerable<OrderDetail>> GetByOrderId(int orderId);
        Task<OrderDetail> Create(OrderDetail orderDetail);
        Task<bool> Update(int id, OrderDetail orderDetail);
        Task<bool> Delete(int id);
    }
}
