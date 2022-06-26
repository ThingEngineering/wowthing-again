using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Identity;
using StackExchange.Redis;
using Wowthing.Lib.Models;
using Wowthing.Web.Services;
using Wowthing.Web.ViewModels;

namespace Wowthing.Web.Controllers
{
    public class UserController : Controller
    {
        private readonly IConnectionMultiplexer _redis;
        private readonly UriService _uriService;
        private readonly UserManager<ApplicationUser> _userManager;

        public UserController(IConnectionMultiplexer redis, UriService uriService, UserManager<ApplicationUser> userManager)
        {
            _redis = redis;
            _uriService = uriService;
            _userManager = userManager;
        }

        [HttpGet("user/{username:username}")]
        public async Task<IActionResult> Index([FromRoute] string username)
        {
            var user = await _userManager.FindByNameAsync(username);
            if (user == null || (User.Identity?.Name != user.UserName && user.Settings?.Privacy?.Public != true))
            {
                return NotFound();
            }

            var expectedUri = await _uriService.GetUriForUser(user: user);
            var actualUri = HttpContext.Request.GetEncodedUrl();
            if (actualUri != expectedUri)
            {
                Console.WriteLine("expected: {0} | actual: {1}", expectedUri, actualUri);
                return Redirect(expectedUri);
            }

            return View(new UserViewModel(_redis, user));
        }
    }
}
