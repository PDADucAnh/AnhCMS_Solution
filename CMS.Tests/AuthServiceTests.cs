using System;
using System.Threading.Tasks;
using CMS.Backend.Services;
using CMS.Data;
using CMS.Data.Entities;
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
        public async Task Register_NewUser_ShouldSucceed()
        {
            // Arrange
            using var context = CreateInMemoryDbContext();
            var authService = new AuthService(context);

            // Act
            var result = await authService.Register("testuser", "Password123!", "Test User");

            // Assert
            Assert.True(result.Success);
            Assert.Equal("Đăng ký thành công!", result.Message);

            var userInDb = await context.Users.FirstOrDefaultAsync(u => u.Username == "testuser");
            Assert.NotNull(userInDb);
            Assert.Equal("Test User", userInDb.FullName);
            Assert.Equal("Customer", userInDb.Role);
        }

        [Fact]
        public async Task Register_ExistingUser_ShouldFail()
        {
            // Arrange
            using var context = CreateInMemoryDbContext();
            var authService = new AuthService(context);
            
            // Seed existing user
            await authService.Register("testuser", "Password123!", "Test User");

            // Act
            var result = await authService.Register("testuser", "DifferentPassword!", "Another Name");

            // Assert
            Assert.False(result.Success);
            Assert.Equal("Tên đăng nhập này đã tồn tại!", result.Message);
        }

        [Fact]
        public async Task Login_CorrectCredentials_ShouldReturnUser()
        {
            // Arrange
            using var context = CreateInMemoryDbContext();
            var authService = new AuthService(context);
            await authService.Register("loginuser", "Password123!", "Login User");

            // Act
            var user = await authService.Login("loginuser", "Password123!");

            // Assert
            Assert.NotNull(user);
            Assert.Equal("loginuser", user.Username);
            Assert.Equal("Login User", user.FullName);
            Assert.NotNull(user.PasswordHash); // PasswordHash should contain the hash, not be null
        }

        [Fact]
        public async Task Login_IncorrectPassword_ShouldReturnNull()
        {
            // Arrange
            using var context = CreateInMemoryDbContext();
            var authService = new AuthService(context);
            await authService.Register("loginuser", "Password123!", "Login User");

            // Act
            var user = await authService.Login("loginuser", "WrongPassword!");

            // Assert
            Assert.Null(user);
        }

        [Fact]
        public async Task Login_NonExistentUser_ShouldReturnNull()
        {
            // Arrange
            using var context = CreateInMemoryDbContext();
            var authService = new AuthService(context);

            // Act
            var user = await authService.Login("nonexistent", "Password123!");

            // Assert
            Assert.Null(user);
        }
    }
}
