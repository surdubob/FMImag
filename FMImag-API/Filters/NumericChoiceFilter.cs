using System.Reflection;
using System.Text.Json;
using FMImag.Model;

namespace FMImag.Filters
{
    public class NumericChoiceFilter : ProductFilter
    {
        IList<RangePair> _ranges;

        public NumericChoiceFilter(string name, IList<RangePair> ranges): base(name)
        {
            _ranges = ranges;
        }

        public override IList<Product> ApplyFilter(IList<Product> products, string propertyName, IList<string> selectedChoices = null)
        {
            List<Product> productsList = new List<Product>();
            foreach (Product prod in products)
            {
                Dictionary<string, string> specsDict = JsonSerializer.Deserialize<Dictionary<string, string>>(prod.Specifications);

                if (specsDict.ContainsKey(propertyName))
                {
                    int value = int.Parse(specsDict[propertyName]);
                    foreach (RangePair rp in _ranges)
                    {
                        if (rp.Min <= value && value <= rp.Max)
                        {
                            productsList.Add(prod);
                            break;
                        }
                    }
                }
            }
            return productsList;
        }
    }

    public class RangePair
    {
        public int Min { get; set; }
        public int Max { get; set; }
        public RangePair(int min, int max)
        {
            Min = min;
            Max = max;
        }
    }
}
