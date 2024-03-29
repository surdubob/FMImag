﻿using System.Reflection;
using System.Text.Json;
using FMImag.Model;

namespace FMImag.Filters
{
    public class StringProductFilter : ProductFilter
    {
        public IList<string> PossibleChoicesList { get; set; }
        public StringProductFilter(string name, IList<string> possibleChoices = null) : base(name)
        {
            PossibleChoicesList = possibleChoices;
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
                    foreach (string ch in selectedChoices)
                    {
                        if (specsDict.ContainsValue(ch))
                        {
                            productsList.Add(prod);
                        }
                    }
                }

            }
            return productsList;
        }
    }
}
