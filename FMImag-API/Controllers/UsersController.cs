using System.Security.Cryptography;
using FMImag.DTOs;
using FMImag.Helper;
using FMImag.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Metadata;

namespace FMImag.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : Controller
    {

        private FmiDBContext dbContext;

        public UsersController(FmiDBContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpPost]
        [AuthorizeRoles(UserRole.ADMIN)]
        public async Task<ActionResult<UserEditDTO>> CreateUser(UserEditDTO user)
        {
            var existingUser = dbContext.Users.FirstOrDefault(usr => usr.Username == user.Username);

            if (existingUser == null)
            {

                SHA256 mySha256 = SHA256.Create();
                byte[] byteSalt = new byte[32];
                var rand = new Random();
                rand.NextBytes(byteSalt);
                string salt = System.Text.Encoding.ASCII.GetString(byteSalt);


                var newUser = dbContext.Users.Add(new User
                {
                    Username = user.Username,
                    Email = user.Email,
                    PhoneNo = user.PhoneNo,
                    UserRole = user.UserRole,
                    Password = System.Text.Encoding.ASCII.GetString(mySha256.ComputeHash(System.Text.Encoding.ASCII.GetBytes(salt + user.Password))),
                    PasswordSalt = salt
                });


                await dbContext.SaveChangesAsync();
                return new UserEditDTO
                {
                    Id = newUser.Entity.Id,
                    Username = newUser.Entity.Username,
                    Email = newUser.Entity.Email,
                    UserRole = newUser.Entity.UserRole,
                    PhoneNo = newUser.Entity.PhoneNo
                };
            }

            return Conflict();
        }
    }
}
