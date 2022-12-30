namespace FMImag.Model
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int UnitsSold { get; set; }
        public int Stock { get; set; }
        public float Price { get; set; }
        public int CategoryId { get; set; }
        public Category Category { get; set; }

        public string ImagePaths { get; set; } // ['...','...']
    }
}
