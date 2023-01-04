using System.Text.Json;
using System.Text.Json.Serialization;
using EmsDTOs;
using FMImag.DTOs;
using FMImag.Filters;
using FMImag.Helper;
using FMImag.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FMImag.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : Controller
    {
        private FmiDBContext dbContext;
        private readonly string contentRoot;
        private readonly string productImagesFolder = "ProductImages";

        public ProductsController(FmiDBContext dbContext, IConfiguration configuration)
        {
            this.dbContext = dbContext;
            contentRoot = configuration.GetValue<string>(WebHostDefaults.ContentRootKey);
        }

        private ProductDTO GetProductWithPicture(Product prod)
        {
            string?[] paths = JsonSerializer.Deserialize<string[]>(prod.ImagePaths);
            List<ImageResponse> images = new List<ImageResponse>();

            foreach (string? p in paths)
            {
                var url = contentRoot + productImagesFolder +
                          Path.DirectorySeparatorChar;
                if (Directory.Exists(url))
                {
                    string[] fileEntries = Directory.GetFiles(url, p);
                    foreach (string fileName in fileEntries)
                    {

                        string type = "";
                        if (fileName.EndsWith(".jpg") || fileName.EndsWith(".jpeg"))
                        {
                            type = "jpg";
                        }
                        else if (fileName.EndsWith(".png"))
                        {
                            type = "png";
                        }

                        byte[] imageArray = System.IO.File.ReadAllBytes(fileName);
                        string base64ImageRepresentation = Convert.ToBase64String(imageArray);

                        images.Add(new ImageResponse()
                        {
                            Content = base64ImageRepresentation,
                            Type = type
                        });
                    }
                }
            }

            return new ProductDTO
            {
                Id = prod.Id,
                Images = images,
                Category = prod.Category,
                CategoryId = prod.CategoryId,
                Description = prod.Description,
                Name = prod.Name,
                Price = prod.Price,
                Stock = prod.Stock,
                UnitsSold = prod.UnitsSold,
                Specifications = prod.Specifications
            };
        }

        [HttpGet]
        public async Task<IEnumerable<ProductDTO>> GetProducts()
        {
            var products = await dbContext.Products.Include(p => p.Category).ToListAsync();
            List<ProductDTO> responseDtos = new List<ProductDTO>();
            foreach (Product prod in products)
            {
                responseDtos.Add(GetProductWithPicture(prod));
            }
            return responseDtos;
        }

        [HttpGet("/api/Product/{productId}")]
        public async Task<ActionResult<ProductDTO>> GetProduct(string productId)
        {
            var product = dbContext.Products.Include(p => p.Category).Where(p => p.Id.ToString() == productId).FirstOrDefault();

            if (product != null)
            {
                return GetProductWithPicture(product);
            }

            return null;
        }

        [HttpGet("TopProducts")]
        public async Task<IEnumerable<ProductDTO>> GetTopProductFromCategories()
        {
            List<ProductDTO> responseDtos = new List<ProductDTO>();
            var categories = await dbContext.Categories.ToListAsync();
            foreach (var category in categories)
            {
                var product = dbContext.Products.Include(p => p.Category).OrderByDescending(p => p.UnitsSold).FirstOrDefault();
                if (product != null)
                {
                    responseDtos.Add(GetProductWithPicture(product));
                }
            }
            return responseDtos;
        }

        [HttpGet("{category}")]
        public async Task<ActionResult<IEnumerable<Product>>> GetProductsByCategory(string category, [FromQuery] Dictionary<string, string> filters)
        {
            List<Product> allProducts = await dbContext.Products.ToListAsync();

            List<ProductFilter> productFilters = null;

            switch (category)
            {
                case "auto":
                    productFilters = FilterHelper.getAutoFilters();
                    break;
                case "telefoane":
                    productFilters = FilterHelper.getAutoFilters();
                    break;
            }

            if (productFilters == null)
            {
                return StatusCode(500);
            }

            foreach (KeyValuePair<string, string> filter in filters)
            {
                foreach (var f in productFilters)
                {
                    if (filter.Key == f.Name)
                    {
                        allProducts = (List<Product>)f.ApplyFilter(allProducts, f.Name, new List<string>{filter.Value});
                    }
                }
            }

            return allProducts.ToList();
        }


        [HttpGet("image/{productId}")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<ImageResponse>>> GetImagePictures(int productId)
        {
            var product = dbContext.Products.FirstOrDefault(p => p.Id == productId);
            if (product == null)
                return NotFound();

            var path = product.ImagePaths;
            if (path != null)
            {
                string?[] paths = JsonSerializer.Deserialize<string[]>(path);
                List<ImageResponse> images = new List<ImageResponse>();

                foreach (string? p in paths)
                {
                    var url = contentRoot + Path.DirectorySeparatorChar + productImagesFolder + Path.DirectorySeparatorChar;
                    if (Directory.Exists(url))
                    {
                        string[] fileEntries = Directory.GetFiles(url, p);
                        foreach (string fileName in fileEntries)
                        {
                            string type = "";
                            if (fileName.EndsWith(".jpg") || fileName.EndsWith(".jpeg"))
                            {
                                type = "jpg";
                            }
                            else if (fileName.EndsWith(".png"))
                            {
                                type = "png";
                            }
                            byte[] imageArray = System.IO.File.ReadAllBytes(fileName);
                            string base64ImageRepresentation = Convert.ToBase64String(imageArray);

                            images.Add(new ImageResponse()
                            {
                                Content = imageArray,
                                Type = type
                            });
                        }
                    }
                }
                return Ok(images);
            }
            return NotFound();
        }


        private void SaveImageToDisk(IEnumerable<ImageResponse> images, string productCode)
        {
            int i = 1;
            foreach (ImageResponse image in images)
            {
                string extension = "";
                if (image.Content.ToString().Contains("jpg") || image.Content.ToString().Contains("jpeg"))
                {
                    extension = "jpg";
                }
                else if (image.Content.ToString().Contains("png"))
                {
                    extension = "png";
                }

                byte[] bytes = Convert.FromBase64String(image.Content.ToString().Split("base64,")[1]);

                var url = contentRoot + Path.DirectorySeparatorChar + productImagesFolder;
                if (Directory.Exists(url))
                {
                    System.IO.File.WriteAllBytes(url + Path.DirectorySeparatorChar + productCode + (i++) + "." + extension, bytes);
                }
            }
        }

        [HttpPost("image/{productId}")]
        [AuthorizeRoles(UserRole.ADMIN)]
        public async Task<ActionResult<string>> UploadLogo(int productId, [FromBody] IEnumerable<ImageResponse> images)
        {
            var prod = dbContext.Products.FirstOrDefault(p => p.Id == productId);
            if (prod == null)
                return NotFound();

            var path = contentRoot + Path.DirectorySeparatorChar + productImagesFolder;
            if (path == null)
            {
                return Problem();
            }

            string productCode = prod.Name.ToLower().Replace(' ', '_');

            if (images != null)
            {
                SaveImageToDisk(images, productCode);
                return Ok();
            }

            return Problem();
        }

        [HttpGet("review/{productId}")]
        [AllowAnonymous]
        public async Task<IEnumerable<Review>> GetProductReviews(int productId)
        {
            var allReviews = dbContext.Reviews.Where(r => r.ProductId == productId);
            return allReviews;
        }

        [HttpPost("postReview")]
        public async Task<ActionResult> UploadProductReview([FromBody] Review review)
        {
            dbContext.Reviews.Add(review);
            dbContext.SaveChanges();
            return Ok();
        }
    }
}
