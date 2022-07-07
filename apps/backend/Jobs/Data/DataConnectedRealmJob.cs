using Wowthing.Backend.Models.API;
using Wowthing.Backend.Models.API.Data;
using Wowthing.Lib.Enums;

namespace Wowthing.Backend.Jobs.Data
{
    public class DataConnectedRealmJob : JobBase
    {
        private const string ApiPath = "data/wow/connected-realm/{0}";

        public override async Task Run(params string[] data)
        {
            var region = (WowRegion)int.Parse(data[0]);
            
            // Fetch API data
            var uri = GenerateUri(region, ApiNamespace.Dynamic, string.Format(ApiPath, data[1]));
            var result = await GetJson<ApiDataConnectedRealm>(uri);

            var realmIds = result.Data.Realms
                .Select(realm => realm.Id)
                .ToArray();
            var realms = await Context.WowRealm
                .Where(realm => realmIds.Contains(realm.Id))
                .ToArrayAsync();

            foreach (var realm in realms)
            {
                realm.ConnectedRealmId = result.Data.Id;
            }
            
            await Context.SaveChangesAsync();
        }
    }
}
