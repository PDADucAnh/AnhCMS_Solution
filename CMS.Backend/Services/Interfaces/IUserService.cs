using CMS.Data.Entities;

namespace CMS.Backend.Services.Interfaces
{
    public interface IUserService
    {
        Task<IEnumerable<object>> GetAll();
        Task<object?> GetById(int id);
        Task<object> Create(User user);
        Task<bool> Update(int id, User user);
        Task<bool> Delete(int id);
        Task<User?> Login(string username, string password);
        Task<(bool Success, string Message)> Register(string username, string password, string fullName);
    }
}
