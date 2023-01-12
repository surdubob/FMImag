using System.Text.Json;
using System.Text.Json.Serialization;
using System.Xml.Linq;
using EmsDTOs;
using FMImag.DTOs;
using FMImag.Filters;
using FMImag.Helper;
using FMImag.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static System.Net.Mime.MediaTypeNames;

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
                OldPrice = prod.OldPrice,
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

        [HttpPost]
        public async Task<ActionResult<ProductDTO>> CreateProduct([FromBody]ProductCreateDTO prod)
        {
            var categ = await dbContext.Categories.FirstOrDefaultAsync(c => c.Id == prod.CategoryId);
            if (categ == null)
            {
                return NotFound();
            }

            string productCode = prod.Name.ToLower().Replace(' ', '_');

            string imagePaths = "[]";
            if (prod.Images.Count > 0)
            {
                imagePaths = SaveImageToDisk(prod.Images, productCode);
            }

            var p = dbContext.Products.Add(new Product
            {
                Name = prod.Name,
                Category = categ,
                CategoryId = categ.Id,
                Price = prod.Price,
                Description = prod.Description,
                Specifications = prod.Specifications,
                Stock = prod.Stock,
                UnitsSold = 0,
                ImagePaths = imagePaths
            }).Entity;

            await dbContext.SaveChangesAsync();

            return Ok(new ProductDTO
            {
                Id = p.Id,
                Category = p.Category,
                Description = p.Description,
                Name = p.Name,
                Images = prod.Images,
                Specifications = prod.Specifications,
                Price = prod.Price,
                Stock = prod.Stock,
                UnitsSold = prod.UnitsSold
            });
        }

        [HttpGet("TopProducts")]
        public async Task<IEnumerable<ProductDTO>> GetTopProductFromCategories()
        {
            List<ProductDTO> responseDtos = new List<ProductDTO>();
            var categories = await dbContext.Categories.ToListAsync();
            foreach (var category in categories)
            {
                var product = dbContext.Products.Include(p => p.Category).Where(p => p.CategoryId == category.Id).OrderByDescending(p => p.UnitsSold).FirstOrDefault();
                if (product != null)
                {
                    responseDtos.Add(GetProductWithPicture(product));
                }
            }
            return responseDtos;
        }

        private string removeNumbers(string text)
        {
            return text.Remove(text.IndexOfAny("0123456789".ToCharArray()));
        }

        [HttpGet("{category}")]
        public async Task<ActionResult<IEnumerable<ProductDTO>>> GetProductsByCategory(string category, [FromQuery] Dictionary<string, string> filters)
        {
            category = category.ToLower();
            List<Product> allProducts = await dbContext.Products.ToListAsync();

            List<StringProductFilter> productFilters = null;

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

            var returnedProducts = new List<Product>();
            foreach (KeyValuePair<string, string> filter in filters)
            {
                foreach (var f in productFilters)
                {
                    if (removeNumbers(filter.Key) == f.Name)
                    {
                        returnedProducts = returnedProducts.Concat((List<Product>)f.ApplyFilter(allProducts, f.Name, new List<string>{filter.Value})).ToList();
                    }
                }
            }

            if (filters.Count == 0)
            {
                returnedProducts = allProducts;
            }

            List<ProductDTO> responseDtos = new List<ProductDTO>();
            foreach (Product prod in returnedProducts)
            {
                responseDtos.Add(GetProductWithPicture(prod));
            }
            return responseDtos;
        }

        [HttpPost("deleteProduct/{productId}")]
        [AllowAnonymous]
        //[AuthorizeRoles(UserRole.ADMIN)]
        public async Task<ActionResult> DeleteProduct(int productId)
        {
            var product = dbContext.Products.FirstOrDefault(p => p.Id == productId);
            if (product != null)
            {
                dbContext.Products.Remove(product);
                await dbContext.SaveChangesAsync();
                return Ok();
            }
            return NotFound();
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


        private string SaveImageToDisk(IEnumerable<ImageResponse> images, string productCode)
        {
            int i = 1;
            if (images.Count() == 0)
            {
                return "[]";
            }
            string paths = "[";
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
                    paths += "\"" + productCode + i + "." + extension + "\",";
                    System.IO.File.WriteAllBytes(url + Path.DirectorySeparatorChar + productCode + i + "." + extension, bytes);
                    i++;
                }
            }

            paths = paths.Substring(0, paths.Length - 1);
            paths += "]";
            return paths;
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
        public async Task<IEnumerable<ReviewDTO>> GetProductReviews(int productId)
        {
            var allReviews = dbContext.Reviews.Where(r => r.ProductId == productId).ToList();
            var reviewDTOs = new List<ReviewDTO>();
            foreach(var r in allReviews)
            {
                reviewDTOs.Add(new ReviewDTO
                {
                    Id = r.Id,
                    ProductId = r.ProductId,
                    UserId = r.UserId,
                    Title = r.Title,
                    Body = r.Body,
                    Rating = r.Rating,
                    Created = r.Created,
                    UserName = dbContext.Users.FirstOrDefault(u => u.Id == r.UserId).Username
                });
            }
            return reviewDTOs;
        }

        [HttpGet("favorite/{userId}/{productId?}")]
        [AllowAnonymous]
        public async Task<ActionResult<ProductDTO>>GetIfProductIsFavorite(int userId, int? productId = -1)
        {  
            if (productId != -1)
            {
                var favoriteProduct = await dbContext.FavoriteProducts.Include(p => p.Product).Where(p => p.ProductId == productId && p.UserId == userId).FirstOrDefaultAsync();
                if (favoriteProduct == null)
                {
                    return Ok(null);
                }
                else
                {
                    return Ok(favoriteProduct);
                }
            }
            else
            {
                var productDTOs = new List<ProductDTO>();
                var favoriteProduct = await dbContext.FavoriteProducts.Include(p => p.Product).Where(p => p.UserId == userId).ToListAsync();
                foreach (var p in favoriteProduct)
                {
                    var product = dbContext.Products.Where(r => r.Id == p.ProductId).FirstOrDefault();
                    if (product != null)
                    {
                        productDTOs.Add(GetProductWithPicture(product));
                    }
                }
                return Ok(productDTOs);
            }
        }

        [HttpPost("addFavorite/{userId}/{productId}")]
        [AllowAnonymous]
        public async Task<ActionResult> AddProductToFavorite(int userId, int productId)
        {
            var product = dbContext.Products.Where(r => r.Id == productId).FirstOrDefault();
            if (product != null)
            {
                dbContext.FavoriteProducts.Add(new FavoriteProducts
                {
                    Product = product,
                    ProductId = productId,
                    UserId = userId
                });
                await dbContext.SaveChangesAsync();
                return Ok();
            }
            return NotFound();
        }

        [HttpPost("removeFavorite/{userId}/{productId}")]
        [AllowAnonymous]
        public async Task<ActionResult> RemoveProductToFavorite(int userId, int productId)
        {
            var favoriteProduct = await dbContext.FavoriteProducts.Include(p => p.Product).Where(p => p.ProductId == productId && p.UserId == userId).FirstOrDefaultAsync();
            if (favoriteProduct != null)
            {
                dbContext.FavoriteProducts.Remove(favoriteProduct);
                await dbContext.SaveChangesAsync();
                return Ok();
            }
            return NotFound();
        }

        [HttpPost("postReview")]
        public async Task<ActionResult> UploadProductReview([FromBody] Review review)
        {
            review.Created = DateTime.Now;
            dbContext.Reviews.Add(review);
            dbContext.SaveChanges();
            return Ok();
        }

        [HttpGet("getCategoryFilters/{category}")]
        public async Task<ActionResult<IEnumerable<ProductFilter>>> GetCategoryFilters(string category)
        {
            category = category.ToLower();
            List<StringProductFilter> productFilters = null;
            switch (category)
            {
                case "auto":
                    productFilters = FilterHelper.getAutoFilters();
                    break;
                case "telefoane":
                    productFilters = FilterHelper.getAutoFilters();
                    break;
            }
            return Ok(productFilters);
        }
    }
}
