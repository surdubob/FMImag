using FMImag.DTOs;
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


        public ProductsController(FmiDBContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpGet]
        public async Task<IEnumerable<Product>> GetProducts() {

            return await dbContext.Products.ToListAsync();

        }

        [HttpGet("{category}")]
        public async Task<IEnumerable<Product>> GetProductsByCategory(string category, [FromQuery] Dictionary<int, string> filter)
        {
            var allProducts = dbContext.Products.ToList();
            var categories = dbContext.Categories.Where(c => c.Name == category).FirstOrDefault();

            if (filter[0] != null)
            {
                var filters = dbContext.Filters.ToList();
                foreach (var fil in filters)
                {
                    if (fil.Name == filter[0])
                    {
                        allProducts = (List<Product>)allProducts.Where(p => p.Category.Name == category);
                    }
                    
                }
                
            }
            return allProducts;

        }

        /*
        private bool ClientExists(int id)
        {
            return _context.Clients.Any(c => c.Id == id);
        }

        [HttpGet("logo/{clientCode}")]
        [AllowAnonymous]
        public async Task<ActionResult<ImageResponse>> GetClientLogo(string clientCode)
        {
            var path = await _context.Parameters.FirstOrDefaultAsync(p => p.Code == "ClientsIconsFolderPath");
            if (path != null)
            {
                var url = contentRoot + path.Value;
                if (Directory.Exists(url))
                {
                    string[] fileEntries = Directory.GetFiles(url, clientCode + "-logo*");
                    foreach (string fileName in fileEntries)
                    {
                        if (fileName.Contains(clientCode))
                        {
                            if (fileName.EndsWith(".svg"))
                            {
                                FileStream fileStream = new FileStream(fileName, FileMode.Open);
                                using (StreamReader reader = new StreamReader(fileStream))
                                {
                                    string content = reader.ReadToEnd().Replace('\n', ' ');
                                    return Ok(new ImageResponse()
                                    {
                                        Content = content,
                                        Type = "svg"
                                    });
                                }
                            }
                            else
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

                                return Ok(new ImageResponse()
                                {
                                    Content = imageArray,
                                    Type = type
                                });
                            }
                        }
                    }
                }
            }
            return NotFound();
        }

        // This method is used to save only jpg or png files!
        private bool SaveLogoToDisk(ImageResponse logo, Parameter path, string clientCode)
        {
            string extension = "";
            if (logo.Content.ToString().Contains("jpg") || logo.Content.ToString().Contains("jpeg"))
            {
                extension = "jpg";
            }
            else if (logo.Content.ToString().Contains("png"))
            {
                extension = "png";
            }

            byte[] bytes = Convert.FromBase64String(logo.Content.ToString().Split("base64,")[1]);

            var url = contentRoot + path.Value;
            if (Directory.Exists(url))
            {
                string[] fileEntries = Directory.GetFiles(url, clientCode + "-logo*");
                foreach (string fileName in fileEntries)
                {
                    System.IO.File.Delete(fileName);
                }
                System.IO.File.WriteAllBytes(url + "\\" + clientCode + "-logo." + extension, bytes);
                return true;
            }
            return false;
        }

        [HttpPut("logo/{clientCode}")]
        [CustomAuthorize(ROLETYPE.Site_admin, ROLETYPE.Admin)]
        public async Task<ActionResult<string>> UploadLogo(string clientCode, [FromBody] ImageResponse logo)
        {
            var path = await _context.Parameters.FirstOrDefaultAsync(p => p.Code == "ClientsIconsFolderPath");
            if (path == null)
            {
                return Problem();
            }

            if (logo != null && !string.IsNullOrEmpty(clientCode))
            {
                if (logo.Type == "svg")
                {
                    string contentString = logo.Content.ToString().Split('"')[3].Split("base64,")[1];

                    byte[] bytes = Convert.FromBase64String(contentString);

                    var url = contentRoot + path.Value;
                    if (Directory.Exists(url))
                    {
                        string[] fileEntries = Directory.GetFiles(url, clientCode + "-logo*");
                        foreach (string fileName in fileEntries)
                        {
                            System.IO.File.Delete(fileName);
                        }
                        System.IO.File.WriteAllBytes(url + "\\" + clientCode + "-logo.svg", bytes);
                        return Ok();
                    }
                }
                else
                {
                    SaveLogoToDisk(logo, path, clientCode);
                    return Ok();
                }
            }

            return Problem();
        }
    */
    }
}
