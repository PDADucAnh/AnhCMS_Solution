using System.Threading.Tasks;
using CMS.Data.Entities;

namespace CMS.Backend.Services.Interfaces
{
    public interface IEmailService
    {
        Task SendOrderConfirmationAsync(Order order, string customerEmail, string customerName);
    }
}
