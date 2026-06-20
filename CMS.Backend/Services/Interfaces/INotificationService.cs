using System.Threading.Tasks;

namespace CMS.Backend.Services.Interfaces
{
    public interface INotificationService
    {
        Task NotifyEntityChanged(string entityName);
    }
}
