using Microsoft.EntityFrameworkCore;

namespace FMImag.Model
{
    public class FmiDBContext: DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }
        public FmiDBContext(DbContextOptions<FmiDBContext> options) : base(options) { }
    }
}
