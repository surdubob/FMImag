using FMImag.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FMImag.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FiltersController : Controller
    {

        private FmiDBContext dbContext;

        public FiltersController(FmiDBContext dbContext)
        {
            this.dbContext = dbContext;
        }
    }
}
