using Wowthing.Lib.Jobs;

namespace Wowthing.Backend.Jobs.Data;

public class DataAuctionsStartJob : JobBase, IScheduledJob
{
    public static readonly ScheduledJob Schedule = new ScheduledJob
    {
        Type = JobType.DataAuctionsStart,
        Priority = JobPriority.High,
        Interval = TimeSpan.FromMinutes(5),
    };

    public override async Task Run(params string[] data)
    {
        var realmIds = await Context.PlayerCharacter
            .Select(pc => pc.RealmId)
            .Distinct()
            .ToArrayAsync();

        var connectedRealmIds = await Context.WowRealm
            .Where(wr => realmIds.Contains(wr.Id))
            .Select(wr => wr.ConnectedRealmId)
            .Distinct()
            .ToArrayAsync();

        foreach (var connectedRealmId in connectedRealmIds)
        {
            await JobRepository.AddJobAsync(JobPriority.Auction, JobType.DataAuctions, connectedRealmId.ToString());
        }
    }
}