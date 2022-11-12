using Microsoft.Extensions.Options;
using Wowthing.Web.Misc;
using Wowthing.Web.Models;
using Wowthing.Web.Services;

namespace Wowthing.Web.Controllers;

public class HomeController : Controller
{
    private readonly UserService _userService;
    private readonly WowthingWebOptions _webOptions;

    public HomeController(
        IOptions<WowthingWebOptions> webOptions,
        UserService userService
    )
    {
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
