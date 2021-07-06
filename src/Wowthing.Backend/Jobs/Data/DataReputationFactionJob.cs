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
    public class DataReputationFactionJob : JobBase
    {
        private const string API_PATH = "data/wow/reputation-faction/{0}";

        public override async Task Run(params string[] data)
        {
            int factionId = int.Parse(data[0]);

            // Fetch API data
            var uri = GenerateUri(WowRegion.US, ApiNamespace.Static, string.Format(API_PATH, factionId));
            var result = await GetJson<ApiDataReputationFaction>(uri);
            if (result.NotModified)
            {
                return;
            }

            var apiFaction = result.Data;

            // Fetch existing data
            var reputation = await _context.WowReputation.FirstOrDefaultAsync(t => t.Id == factionId);
            if (reputation == null)
            {
                reputation = new WowReputation
                {
                    Id = factionId,
                };
                _context.WowReputation.Add(reputation);
            }

            // Update object
            reputation.Name = apiFaction.Name;
            reputation.TierId = apiFaction.Tiers.Id;

            await _context.SaveChangesAsync();
        }
    }
}
