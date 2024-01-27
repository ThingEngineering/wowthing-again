using Wowthing.Backend.Models.API;
using Wowthing.Backend.Models.API.Data;
using Wowthing.Lib.Enums;
using Wowthing.Lib.Jobs;
using Wowthing.Lib.Models.Wow;
using Wowthing.Lib.Utilities;

namespace Wowthing.Backend.Jobs.Data;

public class DataMythicKeystoneSeasonIndexJob : JobBase, IScheduledJob
{
    public static readonly ScheduledJob Schedule = new ScheduledJob
    {
        Type = JobType.DataMythicKeystoneSeasonIndex,
        Priority = JobPriority.High,
        Interval = TimeSpan.FromHours(1),
    };

    private const string ApiPath = "data/wow/mythic-keystone/season/index";

    public override async Task Run(string[] data)
    {
        var seasonMap = await Context.WowMythicPlusSeason
            .ToDictionaryAsync(s => (s.Region, s.Id));

        foreach (var region in EnumUtilities.GetValues<WowRegion>())
        {
            // Fetch API data
            var uri = GenerateUri(region, ApiNamespace.Dynamic, ApiPath);
            var result = await GetUriAsJsonAsync<ApiDataMythicKeystoneSeasonIndex>(uri, useLastModified: false);

            foreach (var apiSeason in result.Data.Seasons)
            {
                if (!seasonMap.ContainsKey((region, apiSeason.Id)))
                {
                    Context.WowMythicPlusSeason.Add(new WowMythicPlusSeason()
                    {
                        Region = region,
                        Id = apiSeason.Id,
                    });
                }
            }
        }

        await Context.SaveChangesAsync();
    }
}
