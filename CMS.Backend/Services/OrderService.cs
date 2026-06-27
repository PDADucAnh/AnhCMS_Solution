using CMS.Data;
using CMS.Data.Entities;
using CMS.Backend.Services.Interfaces;
using CMS.Backend.Models.DTOs;
using CMS.Backend.Utils;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using System;

namespace CMS.Backend.Services
{
    public class OrderService : IOrderService
    {
        private readonly IApplicationDbContext _context;
        private readonly ILogger<OrderService> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IExchangeRateService _exchangeRateService;

        public OrderService(
            IApplicationDbContext context,
            ILogger<OrderService> logger,
            IHttpContextAccessor httpContextAccessor,
            IExchangeRateService exchangeRateService)
        {
            _context = context;
            _logger = logger;
            _httpContextAccessor = httpContextAccessor;
            _exchangeRateService = exchangeRateService;
        }

        private async Task<int?> GetCurrentCustomerId()
        {
            var httpContext = _httpContextAccessor.HttpContext;
            if (httpContext == null) return null;

            var authType = httpContext.User.FindFirst("AuthType")?.Value;
            if (authType != "Customer") return null;

            var email = httpContext.User.Identity?.Name;
            if (string.IsNullOrEmpty(email)) return null;

            var customer = await _context.Customers.FirstOrDefaultAsync(c => c.Email == email);
            return customer?.Id;
        }

        private IQueryable<Order> ApplyOwnershipFilter(IQueryable<Order> query)
        {
            var httpContext = _httpContextAccessor.HttpContext;
            if (httpContext == null) return query;

            var authType = httpContext.User.FindFirst("AuthType")?.Value;
            if (authType == "Customer")
            {
                var email = httpContext.User.Identity?.Name;
                if (!string.IsNullOrEmpty(email))
                {
                    query = query.Where(o => o.Customer != null && o.Customer.Email == email);
                }
            }

            return query;
        }

        public async Task<IEnumerable<OrderDTO>> GetAll()
        {
            IQueryable<Order> query = _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.OrderDetails)
                    .ThenInclude(od => od.Product)
                .OrderByDescending(o => o.OrderDate);

            query = ApplyOwnershipFilter(query);

            var orders = await query.ToListAsync();
            return orders.Select(o => o.ToDTO());
        }

        public async Task<PagedResult<OrderDTO>> GetPaged(int page, int pageSize)
        {
            IQueryable<Order> query = _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.OrderDetails)
                    .ThenInclude(od => od.Product)
                .OrderByDescending(o => o.OrderDate);

            query = ApplyOwnershipFilter(query);

            var totalCount = await query.CountAsync();
            var items = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new PagedResult<OrderDTO>
            {
                Items = items.Select(o => o.ToDTO()).ToList(),
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize
            };
        }

        public async Task<OrderDTO?> GetDetail(int id)
        {
            IQueryable<Order> query = _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.OrderDetails)
                    .ThenInclude(od => od.Product)
                .Where(o => o.Id == id);

            query = ApplyOwnershipFilter(query);

            var order = await query.FirstOrDefaultAsync();
            return order?.ToDTO();
        }

        private async Task<(string Currency, decimal Rate)> ResolveCurrency(string? currency)
        {
            if (currency?.ToUpper() == "VND")
            {
                var rate = await _exchangeRateService.GetUsdToVndRate();
                return ("VND", rate.Rate);
            }
            return ("USD", 1m);
        }

        public async Task<(bool Success, string Message, int OrderId)> CreateOrder(
            int customerId, string? notes, List<OrderItemInput> items, string? currency = null)
        {
            try
            {
                var customerExists = await _context.Customers.AnyAsync(c => c.Id == customerId);
                if (!customerExists)
                    return (false, "Khách hàng không tồn tại", 0);

                var (orderCurrency, exchangeRate) = await ResolveCurrency(currency);

                var newOrder = new Order
                {
                    OrderDate = DateTime.Now,
                    CustomerId = customerId,
                    Status = OrderStatus.Pending,
                    Notes = notes,
                    Currency = orderCurrency,
                    ExchangeRate = exchangeRate
                };

                if (items != null && items.Count > 0)
                {
                    var productIds = items.Select(i => i.ProductId).ToList();
                    var products = await _context.Products
                        .Include(p => p.Translations)
                        .Where(p => productIds.Contains(p.Id))
                        .ToListAsync();
                    var productDict = products.ToDictionary(p => p.Id);

                    foreach (var item in items)
                    {
                        if (!productDict.TryGetValue(item.ProductId, out var product))
                        {
                            throw new KeyNotFoundException($"Sản phẩm không tồn tại");
                        }

                        if (product.StockQuantity < item.Quantity)
                        {
                            var productName = product.Translations.FirstOrDefault(t => t.Locale == "en")?.Name ?? product.Translations.FirstOrDefault()?.Name ?? $"Sản phẩm #{product.Id}";
                            return (false, $"Sản phẩm '{productName}' không đủ hàng (còn: {product.StockQuantity}, yêu cầu: {item.Quantity})", 0);
                        }
                    }

                    newOrder.OrderDetails = items.Select(item =>
                    {
                        var product = productDict[item.ProductId];
                        product.StockQuantity -= item.Quantity;

                        return new OrderDetail
                        {
                            ProductId = item.ProductId,
                            Quantity = item.Quantity,
                            UnitPrice = orderCurrency == "VND"
                                ? PriceHelper.ConvertPrice(product.Price, exchangeRate, "VND")
                                : product.Price,
                            UnitPriceUsd = product.Price,
                            Currency = orderCurrency
                        };
                    }).ToList();
                }

                _context.Orders.Add(newOrder);
                await _context.SaveChangesAsync();

                return (true, "Đặt hàng thành công!", newOrder.Id);
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError(ex, "Database error creating order for customer {CustomerId}", customerId);
                return (false, "Lỗi cơ sở dữ liệu khi tạo đơn hàng", 0);
            }
            catch (KeyNotFoundException ex)
            {
                _logger.LogWarning(ex, "Product not found for customer {CustomerId}", customerId);
                return (false, ex.Message, 0);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error creating order for customer {CustomerId}", customerId);
                return (false, "Lỗi không xác định khi tạo đơn hàng", 0);
            }
        }

        public async Task<bool> Update(int id, UpdateOrderDTO dto)
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
