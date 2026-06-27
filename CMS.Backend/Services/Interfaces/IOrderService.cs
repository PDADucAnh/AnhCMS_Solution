using System.Collections.Generic;
using System.Threading.Tasks;
using CMS.Backend.Models.DTOs;

namespace CMS.Backend.Services.Interfaces
{
    public interface IOrderService
    {
        Task<IEnumerable<OrderDTO>> GetAll();
        Task<PagedResult<OrderDTO>> GetPaged(int page, int pageSize);
        Task<OrderDTO?> GetDetail(int id);
        Task<(bool Success, string Message, int OrderId)> CreateOrder(int customerId, string? notes, List<OrderItemInput> items, string? currency = null);
        Task<bool> Update(int id, UpdateOrderDTO dto);
        Task<bool> Delete(int id);
    }
}
