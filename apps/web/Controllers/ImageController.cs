using Microsoft.Extensions.Logging;
using Wowthing.Lib.Contexts;
using Wowthing.Lib.Enums;

namespace Wowthing.Web.Controllers
{
    [Route("image")]
    public class ImageController : Controller
    {
        private readonly ILogger<ImageController> _logger;
        private readonly WowDbContext _context;

        public ImageController(ILogger<ImageController> logger, WowDbContext context)
        {
            _logger = logger;
            _context = context;
        }
        
        [HttpGet("{typeInt:int}/{hash:length(64)}.{formatString:regex(^(jpeg|png|webp)$)}")]
        [ResponseCache(Duration = 365 * 24 * 60 * 60, VaryByHeader = "Origin")]
        public async Task<IActionResult> Image([FromRoute] int typeInt, [FromRoute] string hash, [FromRoute] string formatString)
        {
            var type = (ImageType)typeInt;
            var format = Enum.Parse<ImageFormat>(formatString, true);

            _logger.LogDebug("type={0} hash={1} format={2}", type, hash, format);
            
            var image = await _context.Image
                .SingleAsync(image =>
                    image.Type == type &&
                    image.Sha256 == hash &&
                    image.Format == format
                );

            string contentType = "";
            switch (format)
            {
                case ImageFormat.Jpeg:
                    contentType = "image/jpeg";
                    break;
                
                case ImageFormat.Png:
                    contentType = "image/png";
                    break;
                
                case ImageFormat.WebP:
                    contentType = "image/webp";
                    break;
            }

            return File(image.Data, contentType);
        }
    }
}
