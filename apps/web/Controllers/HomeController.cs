using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using StackExchange.Redis;
using Wowthing.Lib.Models;
using Wowthing.Lib.Services;
using Wowthing.Web.Misc;
using Wowthing.Web.Models;
using Wowthing.Web.Services;
using Wowthing.Web.ViewModels;

namespace Wowthing.Web.Controllers;

public class HomeController : Controller
{
    private readonly CacheService _cacheService;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly UserService _userService;
    private readonly WowthingWebOptions _webOptions;

    public HomeController(
        CacheService cacheService,
        IOptions<WowthingWebOptions> webOptions,
        UserManager<ApplicationUser> userManager,
        UserService userService
    )
    {
        _cacheService = cacheService;
        _userManager = userManager;
        _userService = userService;
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

            var viewModel = await _userService.CreateViewModel(User, user);
            return View("~/Views/User/Index.cshtml", viewModel);
        }

        return View();
    }
}
