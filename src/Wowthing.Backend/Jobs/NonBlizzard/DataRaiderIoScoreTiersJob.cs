﻿using System;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Wowthing.Backend.Models.API.NonBlizzard;
using Wowthing.Lib.Jobs;

namespace Wowthing.Backend.Jobs.NonBlizzard
{
    public class DataRaiderIoScoreTiersJob : JobBase, IScheduledJob
    {
        public static readonly ScheduledJob Schedule = new ScheduledJob
        {
            Type = JobType.DataRaiderIoScoreTiers,
            Priority = JobPriority.High,
            Interval = TimeSpan.FromHours(1),
        };

        private const string ApiUrl = "https://raider.io/api/v1/mythic-plus/score-tiers";
        public const string CACHE_KEY = "raider_io_tiers";

        public override async Task Run(params string[] data)
        {
            // Fetch API data
            var result = await GetJson<ApiDataRaiderIoScoreTier[]>(new Uri(ApiUrl));

            var db = Redis.GetDatabase();

            var sortedTiers = JsonConvert.SerializeObject(result.Data.OrderByDescending(t => t.Score));
            await db.StringSetAsync(CACHE_KEY, sortedTiers);
        }
    }
}
