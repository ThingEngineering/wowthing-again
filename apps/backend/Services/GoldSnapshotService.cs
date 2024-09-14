using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Serilog;
using Wowthing.Lib.Contexts;
using Wowthing.Lib.Models.Player;
using Wowthing.Lib.Models.Query;
using Wowthing.Lib.Utilities;

namespace Wowthing.Backend.Services;

public class GoldSnapshotService : BackgroundService
{
    private readonly ILogger _logger;
    private readonly IServiceScopeFactory _serviceScopeFactory;

    public GoldSnapshotService(IServiceScopeFactory serviceScopeFactory)
    {
        _serviceScopeFactory = serviceScopeFactory;

        _logger = Log.ForContext("Service", $"GoldSnap");
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            // Wait until the next precise interval
            var now = DateTime.UtcNow;
            var nextWake = now.Date + new TimeSpan(now.Hour + 1, 0, 5);
            //var nextWake = now.Date + new TimeSpan(now.Hour, now.Minute + 1, 5);
            var diff = nextWake.Subtract(now);

            _logger.Debug("Sleeping for {Diff}", diff);

            await Task.Delay(diff, stoppingToken);

            try
            {
                await TakeSnapshot();
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Kaboom!");
            }
        }
    }

    private async Task TakeSnapshot()
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

        // Use hh:mm:00 as the save time
        var now = DateTime.UtcNow;
        var saveTime = now.Date + new TimeSpan(0, now.Hour, now.Minute, 0, 0);

        // TODO check existing
        var latestSnapshots = await context.LatestPlayerAccountGoldSnapshotQuery
            .FromSqlRaw(LatestPlayerAccountGoldSnapshotQuery.Sql)
            .ToDictionaryAsync(gsq => (gsq.AccountId, gsq.RealmId));

        timer.AddPoint("LoadSnaps");

        // Retrieve new gold data
        /*var goldSums = await context.PlayerCharacter
            .AsNoTracking()
            .Where(pc => pc.AccountId != null)
            .GroupBy(pc => new { pc.AccountId, pc.RealmId })
            .Select(group => new
            {
                AccountId = group.Key.AccountId.Value,
                RealmId = group.Key.RealmId,
                Gold = (int)(group.Sum(pc => pc.Copper) / 10000),
            })
            .OrderBy(gs => gs.AccountId)
            .ThenBy(gs => gs.RealmId)
            .ToArrayAsync();*/

        var goldSums = await context.PlayerAccountGoldSnapshotQuery
            .FromSqlRaw(PlayerAccountGoldSnapshotQuery.SqlQuery)
            .ToArrayAsync();

        timer.AddPoint("LoadCurrent");

        // See if anything needs saving
        foreach (var goldSum in goldSums)
        {
            if (!latestSnapshots.TryGetValue((goldSum.AccountId, goldSum.RealmId), out var snapshot) ||
                snapshot.Gold != goldSum.TotalGold)
            {
                context.PlayerAccountGoldSnapshot.Add(new PlayerAccountGoldSnapshot
                {
                    Time = saveTime,
                    AccountId = goldSum.AccountId,
                    RealmId = goldSum.RealmId,
                    Gold = goldSum.TotalGold,
                });
            }
        }

        timer.AddPoint("Create");

        await context.SaveChangesAsync();

        timer.AddPoint("Save", true);
        _logger.Information("GoldSnapshotService: {Times}", timer.ToString());
    }
}
