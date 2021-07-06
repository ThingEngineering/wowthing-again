using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Wowthing.Lib.Contexts;
using Wowthing.Web.Services;

namespace Wowthing.Web.Controllers
{
    [Route("upload")]
    public class UploadController : Controller
    {
        private readonly WowDbContext _context;
        private readonly UploadService _uploadService;

        public UploadController(WowDbContext context, UploadService uploadService)
        {
            _context = context;
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
            // Process upload
            await _uploadService.Process(long.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value), luaFile);

            return Redirect(Url.Action("Index", "Upload"));
        }
    }
}
