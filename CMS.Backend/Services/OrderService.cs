using CMS.Data;
using CMS.Data.Entities;
using CMS.Backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Services
{
    public class OrderService : IOrderService
    {
        private readonly ApplicationDbContext _context;

        public OrderService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Order>> GetAll()
        {
            return await _context.Orders
                .Include(o => o.Customer)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();
        }

        public async Task<Order?> GetDetail(int id)
        {
            return await _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.OrderDetails)
                    .ThenInclude(od => od.Product)
                .FirstOrDefaultAsync(o => o.Id == id);
        }

        public async Task<(bool Success, string Message, int OrderId)> CreateOrder(
            int customerId, string? notes, List<OrderItemInput> items)
        {
            try
            {
                var newOrder = new Order
                {
                    OrderDate = DateTime.Now,
                    CustomerId = customerId,
                    Status = 0,
                    Notes = notes
                };

                if (items != null && items.Count > 0)
                {
                    newOrder.OrderDetails = items.Select(item => new OrderDetail
                    {
                        ProductId = item.ProductId,
                        Quantity = item.Quantity,
                        UnitPrice = item.UnitPrice
                    }).ToList();
                }

                _context.Orders.Add(newOrder);
                await _context.SaveChangesAsync();

                return (true, "Đặt hàng thành công!", newOrder.Id);
            }
            catch (Exception ex)
            {
                return (false, $"Lỗi xử lý tạo đơn hàng ngầm: {ex.Message}", 0);
            }
        }

        public async Task<bool> Update(int id, Order order)
        {
            if (id != order.Id)
                return false;

            _context.Entry(order).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
                return true;
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await _context.Orders.AnyAsync(e => e.Id == id))
                    return false;
                throw;
            }
        }

        public async Task<bool> Delete(int id)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null)
                return false;

            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
