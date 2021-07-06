using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Wowthing.Backend.Models.API;
using Wowthing.Backend.Models.API.Data;
using Wowthing.Lib.Enums;
using Wowthing.Lib.Jobs;
using Wowthing.Lib.Models.Wow;
using Wowthing.Lib.Utilities;

namespace Wowthing.Backend.Jobs.Data
{
    public class DataRealmIndexJob : JobBase, IScheduledJob
    {
        public static readonly ScheduledJob Schedule = new ScheduledJob
        {
            Type = JobType.DataRealmIndex,
            Priority = JobPriority.High,
            Interval = TimeSpan.FromDays(1),
        };

        private const string API_PATH = "data/wow/realm/index";

        public override async Task Run(params string[] data)
        {
            // Fetch existing data
            var realmMap = await _context.WowRealm.ToDictionaryAsync(k => k.Id);

            foreach (var region in EnumUtilities.GetValues<WowRegion>())
            {
                // Fetch API data
                var uri = GenerateUri(region, ApiNamespace.Dynamic, API_PATH);
                var result = await GetJson<ApiDataRealmIndex>(uri);
                if (result.NotModified)
                {
                    continue;
                }

                foreach (var apiRealm in result.Data.Realms)
                {
                    if (!realmMap.TryGetValue(apiRealm.Id, out WowRealm realm))
                    {
                        realm = new WowRealm
                        {
                            Id = apiRealm.Id,
                        };
                        _context.WowRealm.Add(realm);
                    }

                    realm.Region = region;
                    realm.Name = apiRealm.Name;
                    realm.Slug = apiRealm.Slug;
                }
            }

            await _context.SaveChangesAsync();
        }
    }
}
