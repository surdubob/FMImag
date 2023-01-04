using System.Linq.Expressions;
using FMImag.Model;

namespace FMImag.Filters
{
    public abstract class ProductFilter
    {
        public string Name { get; set; }

        public ProductFilter(string name)
        {
            Name = name;
        }

        public abstract IList<Product> ApplyFilter(IList<Product> products, string propertyName, IList<string> selectedChoices = null);
    }
}
