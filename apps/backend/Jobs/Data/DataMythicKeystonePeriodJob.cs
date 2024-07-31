using Wowthing.Backend.Models.API;
using Wowthing.Backend.Models.API.Data;
using Wowthing.Lib.Enums;
using Wowthing.Lib.Models.Wow;

namespace Wowthing.Backend.Jobs.Data;

public class DataMythicKeystonePeriodJob : JobBase
{
    private const string ApiPath = "data/wow/mythic-keystone/period/{0}";

    public override async Task Run(string[] data)
    {
        var region = Enum.Parse<WowRegion>(data[0]);
        int periodId = int.Parse(data[1]);

        // Fetch API data
        var uri = GenerateUri(region, ApiNamespace.Dynamic, string.Format(ApiPath, periodId));
        var result = await GetUriAsJsonAsync<ApiDataMythicKeystonePeriod>(uri);
        if (result.NotModified)
        {
            return;
        }

        // Fetch existing data
        var period = await Context.WowPeriod.FirstOrDefaultAsync(p => p.Region == region && p.Id == periodId);
        if (period == null)
        {
            period = new WowPeriod
            {
                Region = region,
                Id = periodId,
            };
            Context.WowPeriod.Add(period);
        }

        // Update object
        period.Starts = result.Data.StartTimestamp.AsUtcTimestamp();
        period.Ends = result.Data.EndTimestamp.AsUtcTimestamp();

        await Context.SaveChangesAsync();
    }
}
