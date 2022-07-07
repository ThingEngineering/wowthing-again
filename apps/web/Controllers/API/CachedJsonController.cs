﻿using Microsoft.Extensions.Logging;
using StackExchange.Redis;
using Wowthing.Lib.Enums;

namespace Wowthing.Web.Controllers.API;

public class CachedJsonController : Controller
{
    private readonly ILogger<CachedJsonController> _logger;
    private readonly IConnectionMultiplexer _redis;

    public CachedJsonController(
        ILogger<CachedJsonController> logger,
        IConnectionMultiplexer redis
    )
    {
        _logger = logger;
        _redis = redis;
    }

    private readonly HashSet<string> _hasLanguages = new()
    {
        "journal",
        "static",
    };

    [HttpGet("api/{type:regex(^(achievement|journal|static|transmog|zone-map)$)}-{languageCode:length(4)}.{hash:length(32)}.json")]
    [ResponseCache(Duration = 365 * 24 * 60 * 60, VaryByHeader = "Origin")]
    public async Task<IActionResult> CachedJson([FromRoute] string type, [FromRoute] string languageCode, [FromRoute] string hash)
    {
        var db = _redis.GetDatabase();

        if (!Enum.TryParse<Language>(languageCode, out var language))
        {
            language = Language.enUS;
        }

        string key = _hasLanguages.Contains(type) ? $"{type}-{language.ToString()}" : type;
            
        string jsonHash = await db.StringGetAsync($"cache:{key}:hash");
        if (hash != jsonHash)
        {
            return RedirectToAction("CachedJson", new { type, languageCode = language.ToString(), hash = jsonHash });
        }

        return Content(await db.StringGetAsync($"cache:{key}:data"), "application/json");
    }
}
