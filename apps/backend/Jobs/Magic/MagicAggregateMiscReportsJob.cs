using Wowthing.Lib.Enums;
using Wowthing.Lib.Jobs;
using Wowthing.Lib.Models;
using Wowthing.Lib.Utilities;

namespace Wowthing.Backend.Jobs.Magic;

public class MagicAggregateMiscReportsJob : JobBase, IScheduledJob
{
    public static readonly ScheduledJob Schedule = new ScheduledJob
    {
        Type = JobType.MagicAggregateMiscReports,
        Priority = JobPriority.High,
        Interval = TimeSpan.FromMinutes(1),
        Version = 1,
    };

    public override async Task Run(string[] data)
    {
        var timer = new JankTimer();

        var aggregateMap = await Context.MiscAggregate
            .ToDictionaryAsync(ma => (ma.ReportType, ma.Region));

        // Delves
        foreach (var reportType in Enum.GetValues<MiscReportType>())
        {
            foreach (var region in Enum.GetValues<WowRegion>())
            {
                var aggregateKey = (reportType, (short)region);

                var dataCounts = new Dictionary<string, int>();
                var reportQuery = Context.MiscReport
                    .AsNoTracking()
                    .Where(mr => mr.Region == (short)region &&
                                 mr.ExpiresAt > DateTime.UtcNow)
                    .AsAsyncEnumerable();
                await foreach (var report in reportQuery)
                {
                    dataCounts.TryAdd(report.Data, 0);
                    dataCounts[report.Data]++;
                }

                if (!aggregateMap.TryGetValue(aggregateKey, out var dbAggregate))
                {
                    dbAggregate = new MiscAggregate
                    {
                        ReportType = reportType,
                        Region = (short)region,
                    };
                    Context.MiscAggregate.Add(dbAggregate);
                }

                dbAggregate.JsonData = dataCounts.Count > 0
                    ? dataCounts.OrderByDescending(x => x.Value).First().Key
                    : null;
            }
        }

        await Context.SaveChangesAsync();

        timer.AddPoint("Save", true);

        Logger.Information("{timer}", timer.ToString());
    }
}
