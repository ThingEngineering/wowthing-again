using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Wowthing.Lib.Models;
using Wowthing.Lib.Utilities;
using Wowthing.Web.Services;

namespace Wowthing.Web.Controllers;

public class UserController : Controller
{
    private readonly ILogger<UserController> _logger;
    private readonly UriService _uriService;
    private readonly UserService _userService;
    private readonly UserManager<ApplicationUser> _userManager;

    public UserController(
        ILogger<UserController> logger,
        UriService uriService,
        UserManager<ApplicationUser> userManager,
        UserService userService
    )
    {
        _logger = logger;
        _uriService = uriService;
        _userManager = userManager;
        _userService = userService;
    }

    [HttpGet("user/{username:username}")]
    public async Task<IActionResult> Index([FromRoute] string username)
    {
        var timer = new JankTimer();

        var user = await _userManager.FindByNameAsync(username);
        if (user == null || (User.Identity?.Name != user.UserName && user.Settings?.Privacy?.Public != true))
        {
            return NotFound();
        }

        timer.AddPoint("user");

        var expectedUri = await _uriService.GetUriForUser(user: user);
        var actualUri = HttpContext.Request.GetEncodedUrl();
        if (actualUri != expectedUri)
        {
            Console.WriteLine("expected: {0} | actual: {1}", expectedUri, actualUri);
            return Redirect(expectedUri);
        }

        timer.AddPoint("uri");

        var viewModel = await _userService.CreateViewModel(User, user);
        timer.AddPoint("viewmodel", true);

        _logger.LogDebug("{Timer}", timer);

        return View(viewModel);
    }
}
