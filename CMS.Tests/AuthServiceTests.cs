using System;
using System.Threading.Tasks;
using CMS.Backend.Services;
using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace CMS.Tests
{
    public class AuthServiceTests
    {
        private ApplicationDbContext CreateInMemoryDbContext()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            
            return new ApplicationDbContext(options);
        }

        [Fact]
        public async Task Register_NewCustomer_ShouldSucceed()
        {
            // Arrange
            using var context = CreateInMemoryDbContext();
            var authService = new AuthService(context);

            // Act
            var result = await authService.Register("Password123!", "Test User", "test@example.com", "0123456789", "123 Street");

            // Assert
            Assert.True(result.Success);
            Assert.Equal("Registration successful!", result.Message);

            var customerInDb = await context.Customers.FirstOrDefaultAsync(c => c.Email == "test@example.com");
            Assert.NotNull(customerInDb);
            Assert.Equal("Test User", customerInDb.FullName);
            Assert.Equal("0123456789", customerInDb.Phone);
            Assert.Equal("123 Street", customerInDb.Address);
        }

        [Fact]
        public async Task Register_ExistingEmail_ShouldFail()
        {
            // Arrange
            using var context = CreateInMemoryDbContext();
            var authService = new AuthService(context);
            
            // Seed existing customer
            await authService.Register("Password123!", "Test User", "test@example.com", null, null);

            // Act
            var result = await authService.Register("DifferentPassword!", "Another Name", "test@example.com", null, null);

            // Assert
            Assert.False(result.Success);
            Assert.Equal("Email already exists!", result.Message);
        }

        [Fact]
        public async Task Login_CustomerCorrectCredentials_ShouldReturnResult()
        {
            // Arrange
            using var context = CreateInMemoryDbContext();
            var authService = new AuthService(context);
            await authService.Register("Password123!", "Login User", "login@example.com", null, null);

            // Act
            var result = await authService.Login("login@example.com", "Password123!");

            // Assert
            Assert.NotNull(result);
            Assert.Equal("login@example.com", result.Username);
            Assert.Equal("Login User", result.FullName);
            Assert.Equal("login@example.com", result.Email);
            Assert.Equal("Customer", result.Role);
            Assert.Equal("Customer", result.AuthType);
        }

        [Fact]
        public async Task Login_IncorrectPassword_ShouldReturnNull()
        {
            // Arrange
            using var context = CreateInMemoryDbContext();
            var authService = new AuthService(context);
            await authService.Register("Password123!", "Login User", "login@example.com", null, null);

            // Act
            var result = await authService.Login("login@example.com", "WrongPassword!");

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task Login_NonExistentUser_ShouldReturnNull()
        {
            // Arrange
            using var context = CreateInMemoryDbContext();
            var authService = new AuthService(context);

            // Act
            var result = await authService.Login("nonexistent@example.com", "Password123!");

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task Login_AdminUser_ShouldReturnResult()
        {
            // Arrange
            using var context = CreateInMemoryDbContext();
            var authService = new AuthService(context);

            // Seed an admin User directly in the database
            var admin = new User
            {
                Username = "admin",
                FullName = "Admin User",
                Role = "Admin",
                PasswordHash = new PasswordHasher<User>().HashPassword(new User(), "Admin@123")
            };
            context.Users.Add(admin);
            await context.SaveChangesAsync();

            // Act
            var result = await authService.Login("admin", "Admin@123");

            // Assert
            Assert.NotNull(result);
            Assert.Equal("admin", result.Username);
            Assert.Equal("Admin User", result.FullName);
            Assert.Equal("Admin", result.Role);
            Assert.Equal("User", result.AuthType);
        }
    }
}
