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
            
            return filters;
        }

    }
}
