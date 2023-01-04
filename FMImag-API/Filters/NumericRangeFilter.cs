using FMImag.Model;
using System.Linq.Expressions;
using System.Reflection;
using System.Text.Json;

namespace FMImag.Filters
{
    public class NumericRangeFilter : ProductFilter
    {
        public int MinValue { get; set; }
        public int MaxValue { get; set; }

        public NumericRangeFilter(string name, int minValue, int maxValue): base(name)
        {
            MinValue = minValue;
            MaxValue = maxValue;
        }

        public override IList<Product> ApplyFilter(IList<Product> products, string propertyName, IList<string> selectedChoices = null)
        {
            List<Product> productsList = new List<Product>();
            foreach (Product prod in products)
            {
                Dictionary<string, string> specsDict =
                    JsonSerializer.Deserialize<Dictionary<string, string>>(prod.Specifications);

                if (specsDict.ContainsKey(propertyName))
                {
                    int value = int.Parse(specsDict[propertyName]);

                    if (MinValue <= value && value <= MaxValue)
                    {
                        productsList.Add(prod);
                    }
                }
            }
        
            return productsList;
        }
    }
}
