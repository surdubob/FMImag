using FMImag.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FMImag.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CartController : Controller
    {

        private FmiDBContext dbContext;

        public CartController(FmiDBContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpPost("{productId}/{stock?}")]
        public async Task<IActionResult> UpdatateStock(string productId, string? stock = "-1")
        {
            var product = await dbContext.Products.FirstOrDefaultAsync(p => p.Id.ToString() == productId);
            if (product != null)
            {
                if (stock != "-1") 
                { 
                    product.Stock = Int32.Parse(stock);
                } 
                else
                {
                    product.Stock = product.Stock - 1;
                }
            }
            dbContext.SaveChanges();
            return Ok();
        }
    }
}
