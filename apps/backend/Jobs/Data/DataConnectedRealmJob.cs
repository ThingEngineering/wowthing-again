using System.Net.Http;
using Wowthing.Backend.Models.API;
using Wowthing.Backend.Models.API.Data;
using Wowthing.Lib.Enums;

namespace Wowthing.Backend.Jobs.Data;

public class DataConnectedRealmJob : JobBase
{
    private const string ApiPath = "data/wow/connected-realm/{0}";

    public override async Task Run(string[] data)
    {
        var region = (WowRegion)int.Parse(data[0]);

        // Fetch API data
        var uri = GenerateUri(region, ApiNamespace.Dynamic, string.Format(ApiPath, data[1]));

        ApiDataConnectedRealm resultData;
        try
        {
            var result = await GetUriAsJsonAsync<ApiDataConnectedRealm>(uri);
            resultData = result.Data;
        }
        catch (HttpRequestException e)
        {
            Logger.Error("HTTP {0}", e.Message);
            return;
        }

        var realmMap = resultData.Realms
            .ToDictionary(realm => realm.Id);
        int[] realmIds = realmMap.Keys.ToArray();
        var dbRealms = await Context.WowRealm
            .Where(realm => realmIds.Contains(realm.Id))
            .ToArrayAsync();

        foreach (var dbRealm in dbRealms)
        {
            var apiRealm = realmMap[dbRealm.Id];

            dbRealm.ConnectedRealmId = resultData.Id;
            dbRealm.Locale = apiRealm.Locale;
        }

        await Context.SaveChangesAsync(CancellationToken);
    }
}
