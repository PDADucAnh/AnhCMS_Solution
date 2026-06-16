using CMS.Data;
using CMS.Data.Entities;
using CMS.Backend.Services.Interfaces;
using CMS.Backend.Models.DTOs;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CMS.Backend.Services
{
    public class OrderDetailService : IOrderDetailService
    {
        private readonly IApplicationDbContext _context;

        public OrderDetailService(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<OrderDetailDTO>> GetAll()
        {
            var list = await _context.OrderDetails
                .Include(od => od.Order)
                    .ThenInclude(o => o.Customer)
                .Include(od => od.Product)
                    .ThenInclude(p => p.CategoryProduct)
                .ToListAsync();
            return list.Select(od => od.ToDTO());
        }

        public async Task<OrderDetailDTO?> GetById(int id)
        {
            var detail = await _context.OrderDetails
                .Include(od => od.Order)
                    .ThenInclude(o => o.Customer)
                .Include(od => od.Product)
                    .ThenInclude(p => p.CategoryProduct)
                .FirstOrDefaultAsync(od => od.Id == id);
            return detail?.ToDTO();
        }

        public async Task<OrderDetailDTO> Create(OrderDetailDTO dto)
        {
            var orderDetail = new OrderDetail
            {
                OrderId = dto.OrderId,
                ProductId = dto.ProductId,
                Quantity = dto.Quantity,
                UnitPrice = dto.UnitPrice
            };
            _context.OrderDetails.Add(orderDetail);
            await _context.SaveChangesAsync();
            return orderDetail.ToDTO();
        }

        public async Task<bool> Update(int id, OrderDetailDTO dto)
        {
            if (id != dto.Id)
                return false;

            var orderDetail = await _context.OrderDetails.FindAsync(id);
            if (orderDetail == null)
                return false;

            orderDetail.OrderId = dto.OrderId;
            orderDetail.ProductId = dto.ProductId;
            orderDetail.Quantity = dto.Quantity;
            orderDetail.UnitPrice = dto.UnitPrice;

            try
            {
                await _context.SaveChangesAsync();
                return true;
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await _context.OrderDetails.AnyAsync(e => e.Id == id))
                    return false;
                throw;
            }
        }

        public async Task<bool> Delete(int id)
        {
            var orderDetail = await _context.OrderDetails.FindAsync(id);
            if (orderDetail == null)
                return false;

            _context.OrderDetails.Remove(orderDetail);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
