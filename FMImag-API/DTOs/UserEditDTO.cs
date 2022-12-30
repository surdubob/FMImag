using FMImag.Model;

namespace FMImag.DTOs
{
    public class UserEditDTO
    {
        public int? Id { get; set; }

        public UserRole UserRole { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public string PhoneNo { get; set; }
    }
}
