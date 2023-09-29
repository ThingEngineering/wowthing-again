using Wowthing.Lib.Constants;
using Wowthing.Lib.Enums;
using Wowthing.Lib.Jobs;
using Wowthing.Lib.Models.Query;

namespace Wowthing.Backend.Jobs.Data;

public class DataAuctionsStartJob : JobBase, IScheduledJob
{
    private const int CheckInterval = 55 * 60; // 55 minutes

    public static readonly ScheduledJob Schedule = new ScheduledJob
    {
        Type = JobType.DataAuctionsStart,
        Priority = JobPriority.High,
        Interval = TimeSpan.FromMinutes(1),
        Version = 2,
    };

    public override async Task Run(params string[] data)
    {
        long unixNow = DateTime.UtcNow.ToUnixTimeSeconds();

        var db = Redis.GetDatabase();
        var lastChecked = (await db.HashGetAllAsync(RedisKeys.CheckedAuctions))
            .ToDictionary(
                entry => (int)entry.Name,
                entry => (long)entry.Value
            );

        var activeRealms = await Context.ActiveConnectedRealmQuery
            .FromSqlRaw(ActiveConnectedRealmQuery.Sql)
            .ToListAsync();

        // Add
        var regions = new HashSet<WowRegion>();
        foreach (var activeRealm in activeRealms)
        {
            regions.Add(activeRealm.Region);
        }

        var connectedRealms = activeRealms
            .Union(regions.Select(region => new ActiveConnectedRealmQuery
            {
                ConnectedRealmId = 100000 + (int)region,
                Region = region
            }))
            .OrderBy(ar => lastChecked.GetValueOrDefault(ar.ConnectedRealmId, 0))
            .ToArray();

        foreach (var connectedRealm in connectedRealms)
        {
            if (!lastChecked.TryGetValue(connectedRealm.ConnectedRealmId, out long realmChecked) || (unixNow - realmChecked) > CheckInterval)
            {
                // Logger.Debug("Checking auctions for {realm} after {interval}", connectedRealmId, unixNow - realmChecked);
                await JobRepository.AddJobAsync(JobPriority.Auction, JobType.DataAuctions,
                    ((int)connectedRealm.Region).ToString(), connectedRealm.ConnectedRealmId.ToString());
            }
        }
    }
}
