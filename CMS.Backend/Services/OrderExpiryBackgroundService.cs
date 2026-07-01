using CMS.Backend.Services.Interfaces;
using CMS.Data;
using CMS.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace CMS.Backend.Services
{
    public class OrderExpiryBackgroundService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<OrderExpiryBackgroundService> _logger;

        public OrderExpiryBackgroundService(IServiceProvider serviceProvider, ILogger<OrderExpiryBackgroundService> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("OrderExpiryBackgroundService is starting.");

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    _logger.LogDebug("Scanning for expired orders...");
                    await ProcessExpiredOrdersAsync(stoppingToken);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error occurred while executing OrderExpiryBackgroundService.");
                }

                await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);
            }

            _logger.LogInformation("OrderExpiryBackgroundService is stopping.");
        }

        private async Task ProcessExpiredOrdersAsync(CancellationToken stoppingToken)
        {
            using (var scope = _serviceProvider.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<IApplicationDbContext>();
                var stockLockService = scope.ServiceProvider.GetRequiredService<StockLockService>();
                var deliverySlotService = scope.ServiceProvider.GetRequiredService<IDeliverySlotService>();

                var now = DateTime.Now;
                var codCutoff = now.AddMinutes(-30);
                var onlineCutoff = now.AddMinutes(-15);

                var expiredOrders = await context.Orders
                    .Include(o => o.OrderDetails)
                    .Where(o =>
                        (o.PaymentMethod == PaymentMethod.COD && o.Status == OrderStatus.PendingVerification && o.OrderDate <= codCutoff) ||
                        (o.PaymentMethod == PaymentMethod.OnlinePayment && o.Status == OrderStatus.Pending && o.OrderDate <= onlineCutoff)
                    )
                    .ToListAsync(stoppingToken);

                if (expiredOrders.Any())
                {
                    _logger.LogInformation("Found {Count} expired orders to cancel.", expiredOrders.Count);

                    foreach (var order in expiredOrders)
                    {
                        order.Status = OrderStatus.Cancelled;
                        order.CancelledAt = now;

                        if (order.PaymentMethod == PaymentMethod.COD)
                        {
                            order.CancellationReason = "Tự động hủy đơn COD quá hạn 30 phút chưa xác minh";

                            // Restore stock in database since it was deducted on creation for COD
                            if (order.OrderDetails != null && order.OrderDetails.Any())
                            {
                                var productIds = order.OrderDetails.Select(od => od.ProductId).ToList();
                                var products = await context.Products
                                    .Where(p => productIds.Contains(p.Id))
                                    .ToListAsync(stoppingToken);

                                foreach (var detail in order.OrderDetails)
                                {
                                    var product = products.FirstOrDefault(p => p.Id == detail.ProductId);
                                    if (product != null)
                                    {
                                        product.StockQuantity += detail.Quantity;
                                    }
                                }
                            }
                        }
                        else if (order.PaymentMethod == PaymentMethod.OnlinePayment)
                        {
                            order.CancellationReason = "Tự động hủy đơn hàng quá hạn thanh toán 15 phút";
                        }

                        // Release delivery slot and release reserved stock
                        if (order.OrderDetails != null)
                        {
                            foreach (var detail in order.OrderDetails)
                            {
                                if (order.DeliveryDate.HasValue && !string.IsNullOrEmpty(order.DeliveryTimeSlot))
                                {
                                    await deliverySlotService.ReleaseSlot(detail.ProductId, order.DeliveryDate.Value, order.DeliveryTimeSlot);
                                }

                                stockLockService.ReleaseReservedStock(detail.ProductId, detail.Quantity);
                            }
                        }
                    }

                    await context.SaveChangesAsync(stoppingToken);
                    _logger.LogInformation("Successfully cancelled {Count} expired orders and released slots/stock locks.", expiredOrders.Count);
                }
            }
        }
    }
}
