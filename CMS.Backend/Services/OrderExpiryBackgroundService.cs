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
                var orderService = scope.ServiceProvider.GetRequiredService<IOrderService>();

                var now = DateTime.Now;
                var codCutoff = now.AddMinutes(-30);
                var onlineCutoff = now.AddMinutes(-15);

                var expiredOrders = await context.Orders
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
                        string reason = order.PaymentMethod == PaymentMethod.COD
                            ? "Tự động hủy đơn COD quá hạn 30 phút chưa xác minh"
                            : "Tự động hủy đơn hàng quá hạn thanh toán 15 phút";

                        await orderService.CancelWithReason(order.Id, reason);
                    }
                    _logger.LogInformation("Successfully cancelled {Count} expired orders centrally.", expiredOrders.Count);
                }
            }
        }
    }
}
