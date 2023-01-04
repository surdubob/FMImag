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

        [HttpGet]
        public async Task<IActionResult> GetAllCategories()
        {
            return Ok(dbContext.Categories);
        }

    }
}
