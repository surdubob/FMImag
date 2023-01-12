namespace FMImag.Model
{
    public class FavoriteProducts
    {
        public int Id { get; set; }
        public int UserId { get; set; }

        public int ProductId { get; set; }
        public Product Product { get; set; }

    }
}
