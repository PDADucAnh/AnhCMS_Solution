namespace CMS.Backend.Models.DTOs
{
    public class UserDTO
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string FullName { get; set; }
        public string Role { get; set; }
    }

    public class CreateUserDTO
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public string FullName { get; set; }
        public string Role { get; set; }
    }

    public class UpdateUserDTO
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string? Password { get; set; } // Optional password update
        public string FullName { get; set; }
        public string Role { get; set; }
    }
}
