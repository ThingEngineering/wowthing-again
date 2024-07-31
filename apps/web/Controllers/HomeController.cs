using Microsoft.Extensions.Options;
using Wowthing.Web.Misc;
using Wowthing.Web.Models;
using Wowthing.Web.Services;
using Wowthing.Web.ViewModels;

namespace Wowthing.Web.Controllers;

public class HomeController : Controller
{
    private readonly MemoryCacheService _memoryCacheService;
    private readonly UserService _userService;
    private readonly WowthingWebOptions _webOptions;

    public HomeController(
        MemoryCacheService memoryCacheService,
        UserService userService,
        IOptions<WowthingWebOptions> webOptions
    )
    {
        _memoryCacheService = memoryCacheService;
        _userService = userService;
        _webOptions = webOptions.Value;
    }

    [HttpGet("")]
    public async Task<IActionResult> Index()
    {
        string requestHost = HttpContext.Request.Host.ToString();
        if (requestHost == $"auctions.{_webOptions.Hostname}")
        {
            var hashes = await _memoryCacheService.GetCachedHashes();
            return View("~/Views/Auctions/Index.cshtml", new AuctionsViewModel(hashes));
        }
        else if (requestHost != _webOptions.Hostname && requestHost.EndsWith($".{_webOptions.Hostname}"))
        {
            var index = requestHost.LastIndexOf(_webOptions.Hostname, StringComparison.Ordinal);
            var username = requestHost[0 .. (index - 1)];
            if (!UsernameRouteConstraint.Regex.IsMatch(username))
            {
                return NotFound();
            }

            var apiResult = await _userService.CheckUser(User, username);
            if (apiResult.NotFound || !apiResult.User.CanUseSubdomain)
            {
                return NotFound();
            }

            var viewModel = await _userService.CreateViewModel(User, apiResult);
            return View("~/Views/User/Index.cshtml", viewModel);
        }

        return View();
    }
}
