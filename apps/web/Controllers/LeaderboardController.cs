using Wowthing.Lib.Contexts;
using Wowthing.Lib.Models;
using Wowthing.Lib.Models.API;
using Wowthing.Web.Services;
using Wowthing.Web.ViewModels;
using JsonSerializer = System.Text.Json.JsonSerializer;

namespace Wowthing.Web.Controllers;

public class LeaderboardController : Controller
{
    private readonly JsonSerializerOptions _jsonSerializerOptions;
    private readonly MemoryCacheService _memoryCacheService;
    private readonly WowDbContext _context;

    public LeaderboardController(
        JsonSerializerOptions jsonSerializerOptions,
        MemoryCacheService memoryCacheService,
        WowDbContext context)
    {
        _jsonSerializerOptions = jsonSerializerOptions;
        _memoryCacheService = memoryCacheService;
        _context = context;
    }

    [HttpGet("leaderboard")]
    public async Task<IActionResult> Index()
    {
        var leaderboards = await _context.UserLeaderboardSnapshot
            .FromSql($@"
SELECT  DISTINCT ON (user_id) *
FROM    user_leaderboard_snapshot
ORDER BY user_id, date DESC
").ToArrayAsync();

        long[] userIds = leaderboards.Select(uls => uls.UserId).ToArray();
        var userMap = await _context.Users
            .Where(user => userIds.Contains(user.Id))
            .ToDictionaryAsync(user => user.Id);

        var data = new List<ApiLeaderboard>();
        foreach (var leaderboard in leaderboards)
        {
            var leaderboardUser = userMap[leaderboard.UserId];
            bool isCurrentUser = User.Identity?.Name == leaderboardUser.UserName;

            if (leaderboardUser.Settings?.Leaderboard?.Enabled == false)
            {
                continue;
            }

            data.Add(new ApiLeaderboard(
                leaderboardUser.Settings?.Leaderboard?.Anonymous == false || isCurrentUser
                    ? leaderboardUser.UserName
                    : null,
                leaderboardUser.Settings?.Privacy?.Public == true,
                leaderboard
            ));
        }

        string leaderboardJson = JsonSerializer.Serialize(data, _jsonSerializerOptions);

        // Settings
        ApplicationUserSettings settings = null;
        if (User.Identity?.Name != null)
        {
            var user = await _memoryCacheService.FindUserByNameAsync(User.Identity.Name);
            if (user != null)
            {
                settings = user.Settings;
            }
        }

        settings ??= new ApplicationUserSettings();
        settings.Migrate();
        string settingsJson = JsonSerializer.Serialize(settings, _jsonSerializerOptions);

        return View(new LeaderboardViewModel(leaderboardJson, settingsJson));
    }
}
