using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using StackExchange.Redis;
using Wowthing.Lib.Models;
using Wowthing.Web.Misc;
using Wowthing.Web.Models;
using Wowthing.Web.ViewModels;

namespace Wowthing.Web.Controllers
{
    public class HomeController : Controller
    {
        private readonly IConnectionMultiplexer _redis;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly WowthingWebOptions _webOptions;

        public HomeController(IConnectionMultiplexer redis, IOptions<WowthingWebOptions> webOptions, UserManager<ApplicationUser> userManager)
        {
            _redis = redis;
            _userManager = userManager;
            _webOptions = webOptions.Value;
        }
        
        [HttpGet("")]
        public async Task<IActionResult> Index()
        {
            var host = HttpContext.Request.Host.ToString();
            if (host != _webOptions.Hostname && host.EndsWith($".{_webOptions.Hostname}"))
            {
                var index = host.LastIndexOf(_webOptions.Hostname, StringComparison.Ordinal);
                var username = host[0 .. (index - 1)];
                if (!UsernameRouteConstraint.Regex.IsMatch(username))
                {
                    return NotFound();
                }

                var user = await _userManager.FindByNameAsync(username);
                if (user == null ||
                    (User?.Identity?.Name != user.UserName && user.Settings?.Privacy?.Public != true) ||
                    !user.CanUseSubdomain
                )
                {
                    return NotFound();
                }
                
                return View("~/Views/User/Index.cshtml", new UserViewModel(_redis, user));
            }
            
            return View();
        }
    }
}
