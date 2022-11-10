using System.Net.Mime;
using Microsoft.Extensions.Logging;
using Wowthing.Lib.Constants;
using Wowthing.Lib.Services;
using Wowthing.Web.Services;

namespace Wowthing.Web.Controllers.API;

public class UserModifiedController : Controller
{
    private readonly ILogger<UserModifiedController> _logger;
    private readonly MemoryCacheService _memoryCacheService;
    private readonly UserService _userService;

    public UserModifiedController(
        ILogger<UserModifiedController> logger,
        MemoryCacheService memoryCacheService,
        UserService userService
    )
    {
        _logger = logger;
        _memoryCacheService = memoryCacheService;
        _userService = userService;
    }

    [HttpGet("api/user/{username:username}/modified")]
    public async Task<IActionResult> UserModified([FromRoute] string username)
    {
        var apiResult = await _userService.CheckUser(User, username);
        if (apiResult.NotFound)
        {
            return NotFound();
        }

        string json = await _memoryCacheService.GetUserModifiedJsonAsync(apiResult);
        return Content(json, MediaTypeNames.Application.Json);
    }
}
