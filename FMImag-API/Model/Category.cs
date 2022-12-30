namespace FMImag.Model
{
    public class Category
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public virtual ICollection<Filter> Filters { get; set; }
        public virtual ICollection<Product> Products { get; set; }
    }
}
