using Wowthing.Backend.Models.API;
using Wowthing.Backend.Models.API.Data;
using Wowthing.Lib.Enums;
using Wowthing.Lib.Models.Wow;

namespace Wowthing.Backend.Jobs.Data;

public class DataReputationTiersJob : JobBase
{
    private const string ApiPath = "data/wow/reputation-tiers/{0}";

    public override async Task Run(params string[] data)
    {
        int tierId = int.Parse(data[0]);

        // Fetch API data
        var uri = GenerateUri(WowRegion.US, ApiNamespace.Static, string.Format(ApiPath, tierId));
        var result = await GetJson<ApiDataReputationTiers>(uri);
        if (result.NotModified)
        {
            return;
        }

        var apiTier = result.Data;

        // Fetch existing data
        var tier = await Context.WowReputationTier.FirstOrDefaultAsync(t => t.Id == tierId);
        if (tier == null)
        {
            tier = new WowReputationTier
            {
                Id = tierId,
            };
            Context.WowReputationTier.Add(tier);
        }

        // Update object
        tier.MinValues = apiTier.Tiers.Select(t => t.MinValue).ToArray();
        tier.MaxValues = apiTier.Tiers.Select(t => t.MaxValue).ToArray();
        tier.Names = apiTier.Tiers.Select(t => t.Name).ToArray();

        await Context.SaveChangesAsync();
    }
}