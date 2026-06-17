using CMS.Backend.Services.Interfaces;
using CMS.Backend.Models.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;

namespace CMS.Backend.Controllers.Api
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly IConfiguration _configuration;

        public AuthController(IAuthService authService, IConfiguration configuration)
        {
            _authService = authService;
            _configuration = configuration;
        }

        private static Claim[] BuildUserClaims(Data.Entities.User user) => new[]
        {
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Role, user.Role),
            new Claim("FullName", user.FullName),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest login)
        {
            var user = await _authService.Login(login.Username, login.Password);

            if (user != null)
            {
                var claimsIdentity = new ClaimsIdentity(
                    BuildUserClaims(user), CookieAuthenticationDefaults.AuthenticationScheme);

                await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme,
                    new ClaimsPrincipal(claimsIdentity));

                // Generate JWT
                var jwtKey = _configuration["Jwt:SecretKey"]
                    ?? throw new InvalidOperationException("Jwt:SecretKey is not configured.");
                var issuer = _configuration["Jwt:Issuer"];
                var audience = _configuration["Jwt:Audience"];
                var expiryMinutes = int.Parse(_configuration["Jwt:ExpiryMinutes"] ?? "60");

                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.UTF8.GetBytes(jwtKey);
                var expiration = DateTime.UtcNow.AddMinutes(expiryMinutes);
                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(BuildUserClaims(user)),
                    Expires = expiration,
                    Issuer = issuer,
                    Audience = audience,
                    SigningCredentials = new SigningCredentials(
                        new SymmetricSecurityKey(key),
                        SecurityAlgorithms.HmacSha256)
                };
                var token = tokenHandler.CreateToken(tokenDescriptor);
                var tokenString = tokenHandler.WriteToken(token);

                return Ok(new
                {
                    token = tokenString,
                    expiresAt = new DateTimeOffset(expiration).ToUnixTimeSeconds(),
                    username = user.Username,
                    fullName = user.FullName,
                    role = user.Role,
                    message = "Đăng nhập thành công"
                });
            }

            return Unauthorized(new { message = "Tên đăng nhập hoặc mật khẩu không đúng!" });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest register)
        {
            var (success, message) = await _authService.Register(
                register.Username, register.Password, register.FullName);

            if (!success)
                return BadRequest(new { message });

            return Ok(new { message });
        }
    }
}
