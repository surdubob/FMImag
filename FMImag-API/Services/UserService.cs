using System.Security.Cryptography;
using FMImag.Helper;
using FMImag.Model;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace FMImag.Services
{
    public class UserService : IUserService
    {
        private readonly FmiDBContext _userContext;
        private readonly AppSettings _appSettings;
        private readonly IJwtUtils _jwtUtils;

        public UserService(FmiDBContext context, IJwtUtils jwtUtils, IOptions<AppSettings> appSettings)
        {
            _userContext = context;
            _jwtUtils = jwtUtils;
            _appSettings = appSettings.Value;
        }

        public AuthenticateResponse Authenticate(AuthenticateRequest model, string ipAddress)
        {

            var user = _userContext.Users
                .FirstOrDefault(u => u.Username == model.Username);
            var mySha256 = SHA256.Create();

            if (user == null || user.Password != System.Text.Encoding.ASCII.GetString(mySha256.ComputeHash(System.Text.Encoding.ASCII.GetBytes(user.PasswordSalt + model.Password))))
                return null;

            RemoveOldRefreshTokens(user);


            var jwtToken = _jwtUtils.GenerateJwtToken(user);
            var refreshToken = _jwtUtils.GenerateRefreshToken(ipAddress);
            user.RefreshTokens.Add(refreshToken);

            _userContext.Update(user);
            _userContext.SaveChanges();

            return new AuthenticateResponse(user, jwtToken, refreshToken.Token, user.UserRole);

        }
        public AuthenticateResponse RefreshToken(string token, string ipAddress)
        {
            var user = GetUserByRefreshToken(token);
            if (user == null)
            {
                return null;
            }
            var refreshToken = user.RefreshTokens.Single(x => x.Token == token);

            if (refreshToken.IsRevoked)
            {
                RevokeDescendantRefreshTokens(refreshToken, user, ipAddress, $"Attempted reuse of revoked ancestor token: {token}");
                _userContext.Update(user);
                _userContext.SaveChanges();
            }

            if (!refreshToken.IsActive) return null;

            var newRefreshToken = RotateRefreshToken(refreshToken, ipAddress); //rotate?
            user.RefreshTokens.Add(newRefreshToken);

            RemoveOldRefreshTokens(user);

            _userContext.Update(user);
            _userContext.SaveChanges();

            var jwtToken = _jwtUtils.GenerateJwtToken(user);

            return new AuthenticateResponse(user, jwtToken, newRefreshToken.Token, user.UserRole);
        }

        public void RevokeToken(string token, string ipAddress)
        {
            var user = GetUserByRefreshToken(token);
            var refreshToken = user.RefreshTokens.Single(x => x.Token == token);

            if (!refreshToken.IsActive) return;

            RevokeRefreshToken(refreshToken, ipAddress, "Revoked without replacement");
            _userContext.Update(user);
            _userContext.SaveChanges();
        }

        private User GetUserByRefreshToken(string token)
        {
            var user = _userContext.Users.Include(u => u.RefreshTokens).SingleOrDefault(u => u.RefreshTokens.Any(t => t.Token == token));
            return user;
        }

        public User GetUserById(int id)
        {
            return _userContext.Users.Where(u => u.Id.Equals(id)).FirstOrDefault();
        }

        private RefreshToken RotateRefreshToken(RefreshToken refreshToken, string ipAddress)
        {
            var newRefreshToken = _jwtUtils.GenerateRefreshToken(ipAddress);
            RevokeRefreshToken(refreshToken, ipAddress, newRefreshToken.Token);
            return newRefreshToken;
        }
        private void RevokeRefreshToken(RefreshToken token, string ipAddress, string replacedByToken = null)
        {
            token.Revoked = DateTime.UtcNow;
            token.ReplacedByToken = replacedByToken;
        }

        private void RemoveOldRefreshTokens(User user)
        {
            foreach (var refreshToken in user.RefreshTokens)
                if (!refreshToken.IsActive &&
                    refreshToken.Created.AddDays(_appSettings.RefreshTokenTTL) <= DateTime.UtcNow)
                    user.RefreshTokens.Remove(refreshToken);
        }

        private void RevokeDescendantRefreshTokens(RefreshToken refreshToken, User user, string ipAddress, string reason)
        {
            if (!string.IsNullOrEmpty(refreshToken.ReplacedByToken))
            {
                var childToken = user.RefreshTokens.SingleOrDefault(x => x.Token == refreshToken.ReplacedByToken);
                if (childToken.IsActive)
                    RevokeRefreshToken(childToken, ipAddress, reason);
                else
                    RevokeDescendantRefreshTokens(childToken, user, ipAddress, reason);
            }
        }
    }
}
