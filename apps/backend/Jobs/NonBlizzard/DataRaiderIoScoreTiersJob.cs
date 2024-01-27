using System.Net.Http;
using Wowthing.Backend.Models.API.NonBlizzard;
using Wowthing.Backend.Models.Data;
using Wowthing.Lib.Jobs;
using Wowthing.Lib.Utilities;

namespace Wowthing.Backend.Jobs.NonBlizzard;

public class DataRaiderIoScoreTiersJob : JobBase, IScheduledJob
{
    public static readonly ScheduledJob Schedule = new ScheduledJob
    {
        Type = JobType.DataRaiderIoScoreTiers,
        Priority = JobPriority.High,
        Interval = TimeSpan.FromHours(1),
        Version = 3,
    };

    private const string ApiUrl = "https://raider.io/api/v1/mythic-plus/score-tiers?season={0}";
    public const string CacheKey = "raider_io_tiers";

    public override async Task Run(string[] data)
    {
        var db = Redis.GetDatabase();

        int minimumSeason = 0;
        var seasons = await db.JsonGetAsync<Dictionary<int, OutRaiderIoScoreTiers>>(CacheKey);
        if (seasons?.Count > 0)
        {
            minimumSeason = seasons.Keys.Max() - 1;
        }
        else
        {
            seasons = new();
        }

        foreach ((string seasonSlug, int seasonId) in ApiCharacterRaiderIoSeason.SeasonMap)
        {
            // bfa-season-1 through 4 have no score colors and just error
            if (seasonId <= 4 || (seasonId < minimumSeason && seasons.ContainsKey(seasonId)))
            {
                Logger.Debug("Skipping season {id}", seasonId);
                continue;
            }

            // Fetch API data
            var timer = new JankTimer();
            string url = string.Format(ApiUrl, seasonSlug);
            try
            {
                var result = await GetUriAsJsonAsync<ApiDataRaiderIoScoreTier[]>(
                    new Uri(url),
                    timer: timer,
                    useAuthorization: false,
                    useLastModified: false
                );

                var ordered = result.Data.OrderByDescending(t => t.Score ?? 0).ToArray();
                seasons[seasonId] = new OutRaiderIoScoreTiers
                {
                    Score = ordered.Select(t => t.Score ?? 0).ToList(),
                    RgbHex = ordered.Select(t => t.RgbHex).ToList(),
                };

                timer.Stop();
                Logger.Information("Updated season {id} - {timer}", seasonId, timer.ToString());
            }
            catch (HttpRequestException ex)
            {
                Logger.Error(ex, "Kaboom! season={id}/{slug}", seasonId, seasonSlug);
            }
        }

        await db.JsonSetAsync(CacheKey, seasons);
    }
}
