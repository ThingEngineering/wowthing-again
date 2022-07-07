﻿using System.Net.Mime;
using Microsoft.Extensions.Logging;
using Wowthing.Lib.Constants;
using Wowthing.Lib.Contexts;
using Wowthing.Lib.Services;
using Wowthing.Lib.Utilities;
using Wowthing.Web.Models;
using Wowthing.Web.Services;

namespace Wowthing.Web.Controllers.API;

public class UserQuestController : Controller
{
    private readonly CacheService _cacheService;
    private readonly ILogger<UserQuestController> _logger;
    private readonly UserService _userService;
    private readonly WowDbContext _context;

    public UserQuestController(
        CacheService cacheService,
        ILogger<UserQuestController> logger,
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

        var (isModified, lastModified) =
            await _cacheService.CheckLastModified(RedisKeys.UserLastModifiedQuests, Request, apiResult);
        if (!isModified)
        {
            return StatusCode((int)HttpStatusCode.NotModified);
        }
        
        timer.AddPoint("LastModified");

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
                Dailies = c.AddonQuests?.Dailies.EmptyIfNull(),
                DailyQuestList = c.AddonQuests?.DailyQuests ?? new List<int>(),
                QuestList = (c.Quests?.CompletedIds ?? new List<int>())
                    .Union(c.AddonQuests?.OtherQuests ?? new List<int>())
                    .Distinct()
                    .ToList(),
                ProgressQuests = c.AddonQuests?.ProgressQuests.EmptyIfNull(),
            }
        );

        timer.AddPoint("Database");

        // Build response
        var data = new UserQuestData
        {
            Characters = characterData,
        };
        var json = JsonConvert.SerializeObject(data);

        timer.AddPoint("JSON", true);
        _logger.LogDebug("{Timer}", timer);

        if (lastModified > DateTimeOffset.MinValue)
        {
            Response.AddApiCacheHeaders(apiResult.Public, lastModified);
        }

        return Content(json, MediaTypeNames.Application.Json);
    }
}
