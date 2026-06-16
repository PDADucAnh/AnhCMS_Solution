using CMS.Data;
using CMS.Data.Entities;
using CMS.Backend.Services.Interfaces;
using CMS.Backend.Models.DTOs;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System;

namespace CMS.Backend.Services
{
    public class OrderService : IOrderService
    {
        private readonly IApplicationDbContext _context;

        public OrderService(IApplicationDbContext context)
        {
            _context = context;
        }

        // === Entity methods (MVC) ===
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
                    var productIds = items.Select(i => i.ProductId).ToList();
                    var products = await _context.Products
                        .Where(p => productIds.Contains(p.Id))
                        .ToListAsync();
                    var productDict = products.ToDictionary(p => p.Id);

                    newOrder.OrderDetails = items.Select(item =>
                    {
                        if (!productDict.TryGetValue(item.ProductId, out var product))
                        {
                            throw new KeyNotFoundException($"Sản phẩm không tồn tại");
                        }

                        return new OrderDetail
                        {
                            ProductId = item.ProductId,
                            Quantity = item.Quantity,
                            UnitPrice = product.Price
                        };
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

        public async Task<Order> Create(Order order)
        {
            _context.Orders.Add(order);
            await _context.SaveChangesAsync();
            return order;
        }

        // === DTO methods (API) ===
        public async Task<IEnumerable<OrderDTO>> GetAllDTO()
        {
            var orders = await _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.OrderDetails)
                    .ThenInclude(od => od.Product)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();

            return orders.Select(o => o.ToDTO());
        }

        public async Task<OrderDTO?> GetDetailDTO(int id)
        {
            var order = await _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.OrderDetails)
                    .ThenInclude(od => od.Product)
                .FirstOrDefaultAsync(o => o.Id == id);

            return order?.ToDTO();
        }

        public async Task<bool> UpdateDTO(int id, UpdateOrderDTO dto)
        {
            if (id != dto.Id)
                return false;

            var order = await _context.Orders.FindAsync(id);
            if (order == null)
                return false;

            dto.UpdateEntity(order);

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
    }
}
