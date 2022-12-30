using System.ComponentModel.DataAnnotations;

namespace FMImag.Model
{
    public class AuthenticateRequest
    {
        [Required]
        public string Username { get; set; }

        [Required] public string Password { get; set; }
    }
}
