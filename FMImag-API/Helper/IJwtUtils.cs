using FMImag.Model;

namespace FMImag.Helper
{
    public interface IJwtUtils
    {
        public string GenerateJwtToken(User user);
        public int ValidateJwtToken(string token);
        public RefreshToken GenerateRefreshToken(string ipAddress);
    }
}
