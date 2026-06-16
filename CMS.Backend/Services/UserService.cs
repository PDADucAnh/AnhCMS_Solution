using CMS.Data;
using CMS.Data.Entities;
using CMS.Backend.Services.Interfaces;
using CMS.Backend.Models.DTOs;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Services
{
    public class UserService : IUserService
    {
        private readonly ApplicationDbContext _context;
        private readonly PasswordHasher<User> _passwordHasher;

        public UserService(ApplicationDbContext context)
        {
            _context = context;
            _passwordHasher = new PasswordHasher<User>();
        }

        public async Task<IEnumerable<UserDTO>> GetAll()
        {
            var users = await _context.Users.ToListAsync();
            return users.Select(u => u.ToDTO());
        }

        public async Task<UserDTO?> GetById(int id)
        {
            var user = await _context.Users.FindAsync(id);
            return user?.ToDTO();
        }

        public async Task<UserDTO> Create(CreateUserDTO dto)
        {
            var user = dto.ToEntity();
            
            // Hash password
            user.PasswordHash = _passwordHasher.HashPassword(user, dto.Password);

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return user.ToDTO();
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
                existingUser.PasswordHash = _passwordHasher.HashPassword(existingUser, user.PasswordHash);
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

        public async Task<bool> UpdateDTO(int id, UpdateUserDTO dto)
        {
            if (id != dto.Id)
                return false;

            var existingUser = await _context.Users.FindAsync(id);
            if (existingUser == null)
                return false;

            existingUser.Username = dto.Username;
            existingUser.FullName = dto.FullName;
            existingUser.Role = dto.Role;

            if (!string.IsNullOrEmpty(dto.Password))
            {
                existingUser.PasswordHash = _passwordHasher.HashPassword(existingUser, dto.Password);
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
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Username == username);

            if (user == null)
                return null;

            PasswordVerificationResult verificationResult;
            try
            {
                verificationResult = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, password);
            }
            catch (FormatException)
            {
                if (user.PasswordHash == password)
                {
                    verificationResult = PasswordVerificationResult.SuccessRehashNeeded;
                }
                else
                {
                    verificationResult = PasswordVerificationResult.Failed;
                }
            }

            if (verificationResult == PasswordVerificationResult.Failed)
                return null;

            if (verificationResult == PasswordVerificationResult.SuccessRehashNeeded)
            {
                user.PasswordHash = _passwordHasher.HashPassword(user, password);
                _context.Users.Update(user);
                await _context.SaveChangesAsync();
            }

            user.PasswordHash = null;
            return user;
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
                FullName = fullName,
                Role = "Customer"
            };

            newUser.PasswordHash = _passwordHasher.HashPassword(newUser, password);

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            return (true, "Đăng ký thành công!");
        }

        public async Task<IEnumerable<User>> GetUsersAsync()
        {
            return await _context.Users.ToListAsync();
        }

        public async Task<User?> GetUserByIdAsync(int id)
        {
            return await _context.Users.FindAsync(id);
        }

        public async Task<bool> UserExistsAsync(string username)
        {
            return await _context.Users.AnyAsync(u => u.Username == username);
        }

        public async Task<bool> CreateUserAsync(User user)
        {
            if (!string.IsNullOrEmpty(user.PasswordHash))
            {
                user.PasswordHash = _passwordHasher.HashPassword(user, user.PasswordHash);
            }
            _context.Users.Add(user);
            return await _context.SaveChangesAsync() > 0;
        }
    }
}
