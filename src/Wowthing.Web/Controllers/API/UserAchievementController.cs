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

public class UserAchievementController : Controller
{
    private readonly CacheService _cacheService;
    private readonly ILogger<UserAchievementController> _logger;
    private readonly UserService _userService;
    private readonly WowDbContext _context;

    public UserAchievementController(
        CacheService cacheService,
        ILogger<UserAchievementController> logger,
        UserService userService,
        WowDbContext context
    )
    {
        _cacheService = cacheService;
        _logger = logger;
        _userService = userService;
        _context = context;
    }

    [HttpGet("api/user/{username:username}/achievements")]
    public async Task<IActionResult> UserAchievementData([FromRoute] string username)
    {
        var timer = new JankTimer();

        var apiResult = await _userService.CheckUser(User, username);
        if (apiResult.NotFound)
        {
            return NotFound();
        }

        timer.AddPoint("CheckUser");

        var (isModified, lastModified) =
            await _cacheService.CheckLastModified(RedisKeys.UserLastModifiedAchievements, Request, apiResult);
        if (!isModified)
        {
            return StatusCode((int)HttpStatusCode.NotModified);
        }
        
        timer.AddPoint("LastModified");

        var achievementsCompleted = await _context.CompletedAchievementsQuery
            .FromSqlRaw(CompletedAchievementsQuery.UserQuery, apiResult.User.Id)
            .ToDictionaryAsync(
                caq => caq.AchievementId,
                caq => caq.Timestamp
            );

        timer.AddPoint("Achievements");

        var criterias = await _context.PlayerCharacterAchievements
            .Where(pca => pca.Character.Account.UserId == apiResult.User.Id)
            .Select(pca => new
            {
                pca.CharacterId,
                pca.CriteriaAmounts,
                pca.CriteriaIds,
            })
            .ToArrayAsync();

        timer.AddPoint("Criteria1b");

        var groupedCriteria = new Dictionary<int, List<int[]>>();
        foreach (var characterCriteria in criterias.EmptyIfNull())
        {
            if (characterCriteria.CriteriaAmounts == null || characterCriteria.CriteriaIds == null)
            {
                continue;
            }

            for (int i = 0; i < characterCriteria.CriteriaIds.Count; i++)
            {
                int criteriaAmount = (int)characterCriteria.CriteriaAmounts[i];
                if (criteriaAmount == 0)
                {
                    continue;
                }

                int criteriaId = characterCriteria.CriteriaIds[i];
                if (!groupedCriteria.TryGetValue(criteriaId, out var blah))
                {
                    blah = groupedCriteria[criteriaId] = new List<int[]>();
                }

                blah.Add(new[] { characterCriteria.CharacterId, criteriaAmount });
            }
        }

        foreach (var items in groupedCriteria.Values)
        {
            items.Sort((a, b) => b[1].CompareTo(a[1]));
        }

        timer.AddPoint("Criteria2b");

        var statistics = await _context.StatisticsQuery
            .FromSqlRaw(StatisticsQuery.UserQuery, apiResult.User.Id)
            .ToArrayAsync();
        
        timer.AddPoint("Statistics");

        var addonAchievements = await _context.PlayerCharacterAddonAchievements
            .Where(pcaa => pcaa.Character.Account.UserId == apiResult.User.Id)
            .ToDictionaryAsync(
                pcaa => pcaa.CharacterId,
                pcaa => pcaa.Achievements
            );

        timer.AddPoint("AddonAchievements");

        // Build response
        var data = new UserAchievementData
        {
            Achievements = achievementsCompleted,
            AddonAchievements = addonAchievements,
            Criteria = groupedCriteria,
            Statistics = statistics
                .ToGroupedDictionary(stat => stat.StatisticId),
        };

        var json = JsonConvert.SerializeObject(data);

        timer.AddPoint("Build", true);
        _logger.LogDebug("{Timer}", timer);

        if (lastModified > DateTimeOffset.MinValue)
        {
            Response.AddApiCacheHeaders(apiResult.Public, lastModified);
        }

        return Content(json, MediaTypeNames.Application.Json);
    }
}
