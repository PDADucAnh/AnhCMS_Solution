using CMS.Data.Entities;
using CMS.Backend.Models.DTOs;

namespace CMS.Backend.Services.Interfaces
{
    public interface IUserService
    {
        Task<IEnumerable<UserDTO>> GetAll();
        Task<UserDTO?> GetById(int id);
        Task<UserDTO> Create(CreateUserDTO dto);
        Task<bool> Update(int id, User user);
        Task<bool> UpdateDTO(int id, UpdateUserDTO dto);
        Task<bool> Delete(int id);
        Task<User?> Login(string username, string password);
        Task<(bool Success, string Message)> Register(string username, string password, string fullName);
        
        // Các phương thức bổ sung cho MVC Controller
        Task<IEnumerable<User>> GetUsersAsync();
        Task<User?> GetUserByIdAsync(int id);
        Task<bool> UserExistsAsync(string username);
        Task<bool> CreateUserAsync(User user);
    }
}
