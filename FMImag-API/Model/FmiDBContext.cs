using Microsoft.EntityFrameworkCore;

namespace FMImag.Model
{
    public class FmiDBContext: DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<FavoriteProducts> FavoriteProducts { get; set; }

        public FmiDBContext(DbContextOptions<FmiDBContext> options) : base(options) { }
    }
}
