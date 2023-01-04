using FMImag.Filters;
using FMImag.Model;

namespace FMImag.Helper
{
    public class FilterHelper
    {
        public static List<ProductFilter> getAutoFilters()
        {
            List<ProductFilter> filters = new List<ProductFilter>();

            filters.Add(new StringProductFilter("Subcategorie"));
            filters.Add(new StringProductFilter("Diametru"));
            filters.Add(new StringProductFilter("Material"));
            
            return filters;
        }

    }
}
