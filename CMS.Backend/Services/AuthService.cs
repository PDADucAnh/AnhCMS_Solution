using CMS.Data;
using CMS.Data.Entities;
using CMS.Backend.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace CMS.Backend.Services
{
    public class AuthService : IAuthService
    {
        private readonly IApplicationDbContext _context;
        private readonly PasswordHasher<User> _passwordHasher;

        public AuthService(IApplicationDbContext context)
        {
            _context = context;
            _passwordHasher = new PasswordHasher<User>();
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
            catch (System.FormatException)
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
    }
}
