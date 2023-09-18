using Wowthing.Lib.Constants;
using Wowthing.Lib.Enums;
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

    public override async Task Run(params string[] data)
    {
        long unixNow = DateTime.UtcNow.ToUnixTimeSeconds();

        var db = Redis.GetDatabase();
        var lastChecked = (await db.HashGetAllAsync(RedisKeys.CheckedAuctions))
            .ToDictionary(
                entry => (int)entry.Name,
                entry => (long)entry.Value
            );

        int[] realmIds = await Context.PlayerCharacter
            .Select(pc => pc.RealmId)
            .Distinct()
            .ToArrayAsync();

        int[] connectedRealmIds = await Context.WowRealm
            .Where(wr => realmIds.Contains(wr.Id))
            .Where(wr => wr.Region != WowRegion.KR && wr.Region != WowRegion.TW) // FIXME remove this if Blizzard ever fixes their broken APIs
            .Select(wr => wr.ConnectedRealmId)
            .Distinct()
            .ToArrayAsync();

        foreach (int connectedRealmId in connectedRealmIds.OrderBy(id => lastChecked.GetValueOrDefault(id, 0)))
        {
            if (!lastChecked.TryGetValue(connectedRealmId, out long realmChecked) || (unixNow - realmChecked) > CheckInterval)
            {
                // Logger.Debug("Checking auctions for {realm} after {interval}", connectedRealmId, unixNow - realmChecked);
                await JobRepository.AddJobAsync(JobPriority.Auction, JobType.DataAuctions, connectedRealmId.ToString());
            }
        }
    }
}
