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
using Wowthing.Lib.Models;
using Wowthing.Lib.Models.Wow;

namespace Wowthing.Backend.Jobs.Data
{
    public class DataReputationTiersJob : JobBase
    {
        private const string API_PATH = "data/wow/reputation-tiers/{0}";

        public override async Task Run(params string[] data)
        {
            int tierId = int.Parse(data[0]);

            // Fetch API data
            var uri = GenerateUri(WowRegion.US, ApiNamespace.Static, string.Format(API_PATH, tierId));
            var result = await GetJson<ApiDataReputationTiers>(uri);
            if (result.NotModified)
            {
                return;
            }

            var apiTier = result.Data;

            // Fetch existing data
            var tier = await _context.WowReputationTier.FirstOrDefaultAsync(t => t.Id == tierId);
            if (tier == null)
            {
                tier = new WowReputationTier
                {
                    Id = tierId,
                };
                _context.WowReputationTier.Add(tier);
            }

            // Update object
            tier.MinValues = apiTier.Tiers.Select(t => t.MinValue).ToArray();
            tier.MaxValues = apiTier.Tiers.Select(t => t.MaxValue).ToArray();
            tier.Names = apiTier.Tiers.Select(t => t.Name).ToArray();

            await _context.SaveChangesAsync();
        }
    }
}
