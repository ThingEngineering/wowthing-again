using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Serilog;
using Wowthing.Lib.Contexts;
using Wowthing.Lib.Models.Query;
using Wowthing.Lib.Models.User;
using Wowthing.Lib.Utilities;

namespace Wowthing.Backend.Services;

public class UserLeaderboardService : BackgroundService
{
    private readonly ILogger _logger;
    private readonly IServiceScopeFactory _serviceScopeFactory;

    public UserLeaderboardService(IServiceScopeFactory serviceScopeFactory)
    {
        _serviceScopeFactory = serviceScopeFactory;

        _logger = Log.ForContext("Service", $"UserLeader");
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            // Wait until the next precise interval
            var now = DateTime.UtcNow;
            var nextWake = now.Date + new TimeSpan(now.Hour + 1, 0, 5);
            // var nextWake = now.Date + new TimeSpan(now.Hour, now.Minute + 1, 5); // DEBUG
            var diff = nextWake.Subtract(now);

            _logger.Debug("Sleeping for {Diff}", diff);
            await Task.Delay(diff, stoppingToken);

            try
            {
                await UpdateLeaderboards();
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Kaboom!");
            }
        }
    }

    private async Task UpdateLeaderboards()
    {
        var timer = new JankTimer();

        using var scope = _serviceScopeFactory.CreateScope();
        var contextFactory = scope.ServiceProvider.GetService<IDbContextFactory<WowDbContext>>();
        if (contextFactory == null)
        {
            _logger.Error("contextFactory is null??");
            return;
        }

        await using var context = await contextFactory.CreateDbContextAsync();

        var nowDate = DateOnly.FromDateTime(DateTime.UtcNow);

        var leaderboardResults = await context.UserLeaderboardQuery
            .FromSqlRaw(UserLeaderboardQuery.Sql)
            .ToArrayAsync();

        long[] userIds = leaderboardResults.Select(ulq => ulq.UserId).ToArray();

        timer.AddPoint("Query");

        var dbMap = await context.UserLeaderboardSnapshot
            .Where(uls => userIds.Contains(uls.UserId) && uls.Date == nowDate)
            .ToDictionaryAsync(uls => uls.UserId);

        timer.AddPoint("Existing");

        foreach (var leaderboardResult in leaderboardResults)
        {
            if (!dbMap.TryGetValue(leaderboardResult.UserId, out var snapshot))
            {
                snapshot = new UserLeaderboardSnapshot(leaderboardResult.UserId)
                {
                    Date = nowDate,
                };
                context.UserLeaderboardSnapshot.Add(snapshot);
            }

            //snapshot.AchievementPointsAlliance
            //snapshot.AchievementPointsHorde
            //snapshot.AchievementPointsOverall
            snapshot.AppearanceIdCount = leaderboardResult.AppearanceIdCount;
            snapshot.AppearanceSourceCount = leaderboardResult.AppearanceSourceCount;
            snapshot.CompletedQuestCount = leaderboardResult.CompletedQuestCount;
            //snapshot.HeirloomCount
            //snapshot.HeirloomLevels
            snapshot.IllusionCount = leaderboardResult.IllusionCount;
            snapshot.MountCount = leaderboardResult.MountCount;
            //snapshot.RecipeCount
            //snapshot.TitleCount
            snapshot.ToyCount = leaderboardResult.ToyCount;
        }

        timer.AddPoint("Process");

        await context.SaveChangesAsync();

        timer.AddPoint("Save");

        _logger.Information("{timer}", timer.ToString());
    }
}
