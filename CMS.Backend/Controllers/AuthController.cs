using CMS.Backend.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _userService;

        public AuthController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest login)
        {
            var user = await _userService.Login(login.Username, login.Password);

            if (user != null)
            {
                return Ok(new
                {
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
            var (success, message) = await _userService.Register(
                register.Username, register.Password, register.FullName);

            if (!success)
                return BadRequest(new { message });

            return Ok(new { message });
        }
    }

    public class LoginRequest
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }

    public class RegisterRequest
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public string FullName { get; set; }
    }
}
