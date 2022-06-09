using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Wowthing.Lib.Constants;
using Wowthing.Lib.Contexts;
using Wowthing.Lib.Services;
using Wowthing.Lib.Utilities;
using Wowthing.Web.Extensions;
using Wowthing.Web.Models;
using Wowthing.Web.Services;

namespace Wowthing.Web.Controllers.API;

public class UserQuestController : Controller
{
    private readonly CacheService _cacheService;
    private readonly ILogger<ApiController> _logger;
    private readonly UserService _userService;
    private readonly WowDbContext _context;

    public UserQuestController(
        CacheService cacheService,
        ILogger<ApiController> logger,
        UserService userService,
        WowDbContext context
    )
    {
        _cacheService = cacheService;
        _logger = logger;
        _userService = userService;
        _context = context;
    }

    [HttpGet("api/user/{username:username}/quests")]
    public async Task<IActionResult> UserQuestData([FromRoute] string username)
    {
        var timer = new JankTimer();

        var apiResult = await _userService.CheckUser(User, username);
        if (apiResult.NotFound)
        {
            return NotFound();
        }

        if (apiResult.Public && !apiResult.Privacy.PublicQuests)
        {
            return Forbid();
        }

        timer.AddPoint("CheckUser");

        DateTimeOffset? lastModified = null;
        if (!apiResult.Public)
        {
            var headers = Request.GetTypedHeaders();
            lastModified = await _cacheService.GetLastModified(RedisKeys.UserLastModifiedQuests, apiResult);
            if (lastModified > DateTimeOffset.MinValue && lastModified <= headers.IfModifiedSince)
            {
                return StatusCode((int)HttpStatusCode.NotModified);
            }
        }

        var characters = await _context.PlayerCharacter
            .Where(pc => pc.Account.UserId == apiResult.User.Id)
            .Include(pc => pc.AddonQuests)
            .Include(pc => pc.Quests)
            .Select(pc => new
            {
                pc.Id,
                pc.AddonQuests,
                pc.Quests,
            })
            .ToArrayAsync();

        var characterData = characters.ToDictionary(
            c => c.Id,
            c => new UserQuestDataCharacter
            {
                ScannedAt = c.AddonQuests?.QuestsScannedAt ?? MiscConstants.DefaultDateTime,
                CallingCompleted = c.AddonQuests?.CallingCompleted.EmptyIfNull(),
                CallingExpires = c.AddonQuests?.CallingExpires.EmptyIfNull(),
                DailyQuestList = c.AddonQuests?.DailyQuests ?? new List<int>(),
                QuestList = (c.Quests?.CompletedIds ?? new List<int>())
                    .Union(c.AddonQuests?.OtherQuests ?? new List<int>())
                    .Distinct()
                    .ToList(),
                ProgressQuests = c.AddonQuests?.ProgressQuests.EmptyIfNull(),
            }
        );

        timer.AddPoint("Get quests");

        // Build response
        var data = new UserQuestData
        {
            Characters = characterData,
        };

        timer.AddPoint("Build response", true);
        _logger.LogDebug($"{timer}");

        if (lastModified > DateTimeOffset.MinValue)
        {
            Response.AddPrivateApiCacheHeaders(lastModified.Value);
        }

        return Ok(data);
    }
}
