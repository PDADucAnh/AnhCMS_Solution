using System.Collections.Generic;
using System.Threading.Tasks;
using CMS.Data.Entities;
using CMS.Backend.Models.DTOs;

namespace CMS.Backend.Services.Interfaces
{
    public interface IOrderService
    {
        // Entity methods (for MVC)
        Task<IEnumerable<Order>> GetAll();
        Task<Order?> GetDetail(int id);
        Task<(bool Success, string Message, int OrderId)> CreateOrder(int customerId, string? notes, List<OrderItemInput> items);
        Task<bool> Update(int id, Order order);
        Task<bool> Delete(int id);
        Task<Order> Create(Order order);

        // DTO methods (for API)
        Task<IEnumerable<OrderDTO>> GetAllDTO();
        Task<OrderDTO?> GetDetailDTO(int id);
        Task<bool> UpdateDTO(int id, UpdateOrderDTO dto);
    }
}
