using System.Threading.Tasks;
using CMS.Backend.Models.DTOs;

namespace CMS.Backend.Services.Interfaces
{
    public interface IAuthService
    {
        Task<LoginResult?> Login(string identifier, string password);
        Task<(bool Success, string Message)> Register(string username, string password, string fullName, string? email, string? phone, string? address);
        Task<LoginResult?> GetProfile(string identifier, string authType);
    }
}
