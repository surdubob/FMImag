using System.Text.Json.Serialization;

namespace FMImag.Model
{
    public class AuthenticateResponse
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Token { get; set; }
        public UserRole Role { get; set; }

        [JsonIgnore]
        public string RefreshToken { get; set; }


        public AuthenticateResponse(User user, string jwtToken, string refreshToken)
        {
            Id = user.Id;
            Username = user.Username;
            Token = jwtToken;
            RefreshToken = refreshToken;
        }
    }
}
