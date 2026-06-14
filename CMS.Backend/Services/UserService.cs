using CMS.Data;
using CMS.Data.Entities;
using CMS.Backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Services
{
    public class UserService : IUserService
    {
        private readonly ApplicationDbContext _context;

        public UserService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<object>> GetAll()
        {
            return await _context.Users
                .Select(u => new
                {
                    u.Id,
                    u.Username,
                    u.FullName,
                    u.Role
                })
                .ToListAsync();
        }

        public async Task<object?> GetById(int id)
        {
            return await _context.Users
                .Select(u => new
                {
                    u.Id,
                    u.Username,
                    u.FullName,
                    u.Role
                })
                .FirstOrDefaultAsync(u => u.Id == id);
        }

        public async Task<object> Create(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return new
            {
                user.Id,
                user.Username,
                user.FullName,
                user.Role
            };
        }

        public async Task<bool> Update(int id, User user)
        {
            if (id != user.Id)
                return false;

            var existingUser = await _context.Users.FindAsync(id);
            if (existingUser == null)
                return false;

            existingUser.Username = user.Username;
            existingUser.FullName = user.FullName;
            existingUser.Role = user.Role;

            if (!string.IsNullOrEmpty(user.PasswordHash))
            {
                existingUser.PasswordHash = user.PasswordHash;
            }

            try
            {
                await _context.SaveChangesAsync();
                return true;
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await _context.Users.AnyAsync(e => e.Id == id))
                    return false;
                throw;
            }
        }

        public async Task<bool> Delete(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return false;

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<User?> Login(string username, string password)
        {
            return await _context.Users
                .FirstOrDefaultAsync(u => u.Username == username && u.PasswordHash == password);
        }

        public async Task<(bool Success, string Message)> Register(string username, string password, string fullName)
        {
            var checkExist = await _context.Users.AnyAsync(u => u.Username == username);
            if (checkExist)
            {
                return (false, "Tên đăng nhập này đã tồn tại!");
            }

            var newUser = new User
            {
                Username = username,
                PasswordHash = password,
                FullName = fullName,
                Role = "Customer"
            };

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            return (true, "Đăng ký thành công!");
        }
    }
}
