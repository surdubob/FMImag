using FMImag.Filters;
using FMImag.Model;

namespace FMImag.Helper
{
    public class FilterHelper
    {
        public static List<StringProductFilter> getAutoFilters()
        {
            List<StringProductFilter> filters = new List<StringProductFilter>();

            filters.Add(new StringProductFilter("Diametru", new List<string>{"17\"", "18\"", "19\""}));
            filters.Add(new StringProductFilter("Material", new List<string>{"Tabla", "Aliaj"}));
            filters.Add(new StringProductFilter("Prezoane", new List<string> { "4", "5" }));
            filters.Add(new StringProductFilter("Latime", new List<string> { "40 mm", "50 mm", "60 mm" }));
            filters.Add(new StringProductFilter("Offset", new List<string> { "20 mm", "50mm" }));

            return filters;
        }

        public static List<StringProductFilter> getPhoneFilters()
        {
            List<StringProductFilter> filters = new List<StringProductFilter>();

            filters.Add(new StringProductFilter("Dimensiune Ecran", new List<string> { "6\"", "6.5\"", "7\"" }));
            filters.Add(new StringProductFilter("RAM", new List<string> { "4 GB", "6 GB", "8 GB" }));
            filters.Add(new StringProductFilter("ROM", new List<string> { "64 GB", "128 GB", "256 GB" }));
            filters.Add(new StringProductFilter("OS", new List<string> { "Android", "IOS" }));
            filters.Add(new StringProductFilter("Baterie", new List<string> { "4000 mAh", "5000 mAh" }));

            return filters;
        }

        public static List<StringProductFilter> getFridgeFilters()
        {
            List<StringProductFilter> filters = new List<StringProductFilter>();

            filters.Add(new StringProductFilter("Usi", new List<string> { "1", "2" }));
            filters.Add(new StringProductFilter("Volum frigider", new List<string> { "150 l", "250 l", "300 l" }));
            filters.Add(new StringProductFilter("Volum congelator", new List<string> { "50 l", "100 l", "125 l" }));
            filters.Add(new StringProductFilter("Clasa energetica", new List<string> { "A", "B", "C", "D" }));
            filters.Add(new StringProductFilter("Zgomot", new List<string> { "30 dB", "40 dB", "50 dB" }));

            return filters;
        }
    }
}
