using System.Net.Mime;
using System.Text.Json;
using Microsoft.Extensions.Logging;
using Wowthing.Lib.Contexts;
using Wowthing.Lib.Models.API;
using Wowthing.Lib.Services;
using Wowthing.Lib.Utilities;
using Wowthing.Web.Services;
using JsonSerializer = System.Text.Json.JsonSerializer;

namespace Wowthing.Web.Controllers.API;

public class UserTransmogController : Controller
{
    private readonly CacheService _cacheService;
    private readonly ILogger<UserTransmogController> _logger;
    private readonly JsonSerializerOptions _jsonSerializerOptions;
    private readonly UserService _userService;
    private readonly WowDbContext _context;

    public UserTransmogController(
        CacheService cacheService,
        ILogger<UserTransmogController> logger,
        JsonSerializerOptions jsonSerializerOptions,
        UserService userService,
        WowDbContext context
    )
    {
        _cacheService = cacheService;
        _logger = logger;
        _jsonSerializerOptions = jsonSerializerOptions;
        _userService = userService;
        _context = context;
    }

    [HttpGet("api/user/{username:username}/transmog-{modified:long}.json")]
    public async Task<IActionResult> UserTransmogData([FromRoute] string username, [FromRoute] long modified)
    {
        var timer = new JankTimer();

        var apiResult = await _userService.CheckUser(User, username);
        if (apiResult.NotFound)
        {
            return NotFound();
        }

        timer.AddPoint("CheckUser");

        var userCache = await _cacheService.CreateOrUpdateTransmogCacheAsync(
            _context, timer, apiResult.User.Id, DateTimeOffset.FromUnixTimeSeconds(modified));

        long lastUnix = userCache.TransmogUpdated.ToUnixTimeSeconds();
        if (lastUnix != modified)
        {
            return RedirectToAction("UserTransmogData", new { username, modified = lastUnix });
        }

        timer.AddPoint("Fetch");

        string json = JsonSerializer.Serialize(new ApiUserTransmog
        {
            AppearanceIds = userCache.AppearanceIds,
            AppearanceSources = userCache.AppearanceSources,
            IllusionIds = userCache.IllusionIds,
        }, _jsonSerializerOptions);

        timer.AddPoint("JSON", true);
        _logger.LogDebug("{Timer}", timer);

        Response.AddLongApiCacheHeaders(userCache.TransmogUpdated);

        return Content(json, MediaTypeNames.Application.Json);
    }
}
