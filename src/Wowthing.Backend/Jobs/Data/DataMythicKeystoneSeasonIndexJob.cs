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
using Wowthing.Lib.Jobs;
using Wowthing.Lib.Models;
using Wowthing.Lib.Models.Wow;
using Wowthing.Lib.Utilities;

namespace Wowthing.Backend.Jobs.Data
{
    public class DataMythicKeystoneSeasonIndexJob : JobBase, IScheduledJob
    {
        public static readonly ScheduledJob Schedule = new ScheduledJob
        {
            Type = JobType.DataMythicKeystoneSeasonIndex,
            Priority = JobPriority.High,
            Interval = TimeSpan.FromHours(1),
        };

        private const string API_PATH = "data/wow/mythic-keystone/season/index";

        public override async Task Run(params string[] data)
        {
            var seasonMap = await _context.WowMythicPlusSeason
                .ToDictionaryAsync(s => (s.Region, s.Id));

            foreach (var region in EnumUtilities.GetValues<WowRegion>())
            {
                // Fetch API data
                var uri = GenerateUri(region, ApiNamespace.Dynamic, API_PATH);
                var result = await GetJson<ApiDataMythicKeystoneSeasonIndex>(uri);
                if (result.NotModified)
                {
                    return;
                }

                foreach (var apiSeason in result.Data.Seasons)
                {
                    if (!seasonMap.TryGetValue((region, apiSeason.Id), out WowMythicPlusSeason season))
                    {
                        _context.WowMythicPlusSeason.Add(new WowMythicPlusSeason()
                        {
                            Region = region,
                            Id = apiSeason.Id,
                        });
                    }
                }
            }

            await _context.SaveChangesAsync();
        }
    }
}
