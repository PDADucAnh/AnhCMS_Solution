using System.Threading.Tasks;
using CMS.Data.Entities;

namespace CMS.Backend.Services.Interfaces
{
    public interface IAuthService
    {
        Task<User?> Login(string username, string password);
        Task<(bool Success, string Message)> Register(string username, string password, string fullName);
    }
}
