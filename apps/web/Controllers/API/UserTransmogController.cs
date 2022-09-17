using System.Net.Mime;
using Microsoft.Extensions.Logging;
using Wowthing.Lib.Constants;
using Wowthing.Lib.Contexts;
using Wowthing.Lib.Models.Query;
using Wowthing.Lib.Services;
using Wowthing.Lib.Utilities;
using Wowthing.Web.Models;
using Wowthing.Web.Services;

namespace Wowthing.Web.Controllers.API;

public class UserTransmogController : Controller
{
    private readonly CacheService _cacheService;
    private readonly ILogger<UserTransmogController> _logger;
    private readonly UserService _userService;
    private readonly WowDbContext _context;

    public UserTransmogController(
        CacheService cacheService,
        ILogger<UserTransmogController> logger,
        UserService userService,
        WowDbContext context
    )
    {
        _cacheService = cacheService;
        _logger = logger;
        _userService = userService;
        _context = context;
    }

    [HttpGet("api/user/{username:username}/transmog")]
    public async Task<IActionResult> UserTransmogData([FromRoute] string username)
    {
        var timer = new JankTimer();

        var apiResult = await _userService.CheckUser(User, username);
        if (apiResult.NotFound)
        {
            return NotFound();
        }

        timer.AddPoint("CheckUser");

        var (isModified, lastModified) =
            await _cacheService.CheckLastModified(RedisKeys.UserLastModifiedTransmog, Request, apiResult);
        if (!isModified)
        {
            return StatusCode((int)HttpStatusCode.NotModified);
        }

        timer.AddPoint("LastModified");

        var allTransmog = await _context.AccountTransmogQuery
            .FromSqlRaw(AccountTransmogQuery.Sql, apiResult.User.Id)
            .FirstAsync();

        var accountSources = await _context.PlayerAccountTransmogSources
            .Where(pats => pats.Account.UserId == apiResult.User.Id)
            .ToArrayAsync();

        var allSources = new HashSet<string>();
        foreach (var sources in accountSources)
        {
            allSources.UnionWith(sources.Sources.EmptyIfNull());
        }

        timer.AddPoint("Get Transmog");

        // Build response
        var data = new UserTransmogData
        {
            Illusions = allTransmog.IllusionIds
                .Distinct()
                .OrderBy(id => id)
                .ToList(),

            Sources = allSources,

            Transmog = allTransmog.TransmogIds
                .Distinct()
                .OrderBy(id => id)
                .ToList(),
        };
        var json = JsonConvert.SerializeObject(data);

        timer.AddPoint("Build response", true);
        _logger.LogDebug("{Timer}", timer);

        if (lastModified > DateTimeOffset.MinValue)
        {
            Response.AddApiCacheHeaders(apiResult.Public, lastModified);
        }

        return Content(json, MediaTypeNames.Application.Json);
    }
}
