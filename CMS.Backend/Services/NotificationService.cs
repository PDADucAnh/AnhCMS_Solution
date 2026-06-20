using CMS.Backend.Hubs;
using CMS.Backend.Services.Interfaces;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace CMS.Backend.Services
{
    public class NotificationService : INotificationService
    {
        private readonly IHubContext<NotificationHub> _hubContext;

        public NotificationService(IHubContext<NotificationHub> hubContext)
        {
            _hubContext = hubContext;
        }

        public async Task NotifyEntityChanged(string entityName)
        {
            await _hubContext.Clients.All.SendAsync("EntityChanged", entityName);
        }
    }
}
