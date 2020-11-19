using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Wowthing.Backend.Models.API;
using Wowthing.Backend.Models.API.Data;
using Wowthing.Lib.Enums;
using Wowthing.Lib.Extensions;
using Wowthing.Lib.Models;
using Wowthing.Lib.Utilities;

namespace Wowthing.Backend.Jobs.Data
{
    public class DataRealmIndexJob : JobBase
    {
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

                foreach (var apiRealm in result.Realms)
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
