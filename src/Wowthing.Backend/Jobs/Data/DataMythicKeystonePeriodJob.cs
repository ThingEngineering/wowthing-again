using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Wowthing.Backend.Models.API;
using Wowthing.Backend.Models.API.Data;
using Wowthing.Lib.Enums;
using Wowthing.Lib.Extensions;
using Wowthing.Lib.Models.Wow;

namespace Wowthing.Backend.Jobs.Data
{
    public class DataMythicKeystonePeriodJob : JobBase
    {
        private const string API_PATH = "data/wow/mythic-keystone/period/{0}";

        public override async Task Run(params string[] data)
        {
            var region = Enum.Parse<WowRegion>(data[0]);
            int periodId = int.Parse(data[1]);

            // Fetch API data
            var uri = GenerateUri(region, ApiNamespace.Dynamic, string.Format(API_PATH, periodId));
            var result = await GetJson<ApiDataMythicKeystonePeriod>(uri);
            if (result.NotModified)
            {
                return;
            }

            var apiClass = result.Data;

            // Fetch existing data
            var period = await _context.WowPeriod.FirstOrDefaultAsync(p => p.Region == region && p.Id == periodId);
            if (period == null)
            {
                period = new WowPeriod
                {
                    Region = region,
                    Id = periodId,
                };
                _context.WowPeriod.Add(period);
            }

            // Update object
            period.Starts = result.Data.StartTimestamp.AsUtcTimestamp();
            period.Ends = result.Data.EndTimestamp.AsUtcTimestamp();

            await _context.SaveChangesAsync();
        }
    }
}
