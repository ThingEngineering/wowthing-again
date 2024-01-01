using Wowthing.Lib.Constants;
using Wowthing.Lib.Jobs;

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

    public override async Task Run(string[] data)
    {
        long unixNow = DateTime.UtcNow.ToUnixTimeSeconds();

        var db = Redis.GetDatabase();
        var lastChecked = (await db.HashGetAllAsync(RedisKeys.CheckedAuctions))
            .ToDictionary(
                entry => (int)entry.Name,
                entry => (long)entry.Value
            );

        var connectedRealms = await MemoryCacheService.GetAuctionConnectedRealms();

        foreach (var connectedRealm in connectedRealms.OrderBy(ar => lastChecked.GetValueOrDefault(ar.ConnectedRealmId, 0)))
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
