using Wowthing.Backend.Models.API;
using Wowthing.Backend.Models.API.Data;
using Wowthing.Lib.Enums;
using Wowthing.Lib.Jobs;
using Wowthing.Lib.Utilities;

namespace Wowthing.Backend.Jobs.Data;

public class DataMythicKeystonePeriodIndexJob : JobBase, IScheduledJob
{
    public static readonly ScheduledJob Schedule = new ScheduledJob
    {
        Type = JobType.DataMythicKeystonePeriodIndex,
        Priority = JobPriority.High,
        Interval = TimeSpan.FromHours(1),
    };

    private const string ApiPath = "data/wow/mythic-keystone/period/index";

    public override async Task Run(string[] data)
    {
        var periodMap = await Context.WowPeriod
            .ToDictionaryAsync(period => (period.Region, period.Id));

        foreach (var region in EnumUtilities.GetValues<WowRegion>())
        {
            // Fetch API data
            var uri = GenerateUri(region, ApiNamespace.Dynamic, ApiPath);
            var result = await GetJson<ApiDataMythicKeystonePeriodIndex>(uri, useLastModified: false);

            foreach (var period in result.Data.Periods.TakeLast(5))
            {
                // Absolute garbage API design on Blizzard's part, cool
                if (!periodMap.ContainsKey((region, period.Id)))
                {
                    await JobRepository.AddJobAsync(JobPriority.High, JobType.DataMythicKeystonePeriod,
                        region.ToString(), period.Id.ToString());
                }
            }
        }
    }
}
