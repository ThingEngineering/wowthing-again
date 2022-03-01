using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Wowthing.Web.Services;

namespace Wowthing.Web.Controllers
{
    [Route("upload")]
    public class UploadController : Controller
    {
        private readonly UploadService _uploadService;

        public UploadController(UploadService uploadService)
        {
            _uploadService = uploadService;
        }

        [Authorize]
        [HttpGet("")]
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost("web")]
        [Authorize]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> FromWeb([FromForm] IFormFile luaFile)
        {
            string userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return Forbid();
            }
            
            // Process upload
            await _uploadService.Process(long.Parse(userId), luaFile);

            return Redirect(Url.Action("Index", "Upload"));
        }
    }
}
