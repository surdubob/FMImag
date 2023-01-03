using FMImag.Model;
using Microsoft.AspNetCore.Mvc;

namespace FMImag.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : Controller
    {

        private FmiDBContext dbContext;

        public CategoriesController (FmiDBContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpGet("getAllCategories")]
        public async Task<IActionResult> GetAllCategories()
        {
            return Ok(dbContext.Categories);
        }

        [HttpGet("getFiltersOfCategoriy")]
        public async Task<ActionResult<IEnumerable<Filter>>> GetFiltersOfCategory(string categoryName)
        {
            var cat = dbContext.Categories.FirstOrDefault(c => c.Name == categoryName); 
            if (cat == null)
            {
                return NotFound();
            }
            return Ok(cat.Filters);
        }

    }
}
