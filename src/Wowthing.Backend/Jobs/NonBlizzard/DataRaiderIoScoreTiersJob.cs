using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Wowthing.Backend.Models.API.NonBlizzard;
using Wowthing.Lib.Extensions;
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

        private const string ApiUrl = "https://raider.io/api/v1/mythic-plus/score-tiers?season={0}";
        public const string CACHE_KEY = "raider_io_tiers";

        public override async Task Run(params string[] data)
        {
            var seasons = new Dictionary<int, List<ApiDataRaiderIoScoreTier>>();
        
            foreach (var (seasonSlug, seasonId) in ApiCharacterRaiderIoSeason.SeasonMap)
            {
                // Fetch API data
                var url = string.Format(ApiUrl, seasonSlug);
                try
                {
                    var result = await GetJson<ApiDataRaiderIoScoreTier[]>(new Uri(url));
                    seasons[seasonId] = result.Data.OrderByDescending(t => t.Score).ToList();
                }
                catch (HttpRequestException ex)
                {
                    Logger.Error(ex, "Kaboom!");
                }
            }

            var db = Redis.GetDatabase();
            await db.JsonSetAsync(CACHE_KEY, seasons);
        }
    }
}
