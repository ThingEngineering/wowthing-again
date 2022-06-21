using System.Net.Http;
using Wowthing.Backend.Models.API.Character;
using Wowthing.Lib.Constants;
using Wowthing.Lib.Models.Player;
using Wowthing.Lib.Models.Query;
using Wowthing.Lib.Utilities;

namespace Wowthing.Backend.Jobs.Character;

public class CharacterStatisticsJob : JobBase
{
    private const string ApiPath = "profile/wow/character/{0}/{1}/achievements/statistics";

    public override async Task Run(params string[] data)
    {
        var query = JsonConvert.DeserializeObject<SchedulerCharacterQuery>(data[0]) ??
                    throw new InvalidJsonException(data[0]);
        using var shrug = CharacterLog(query);

        var timer = new JankTimer();

        // Fetch API data
        ApiCharacterStatistics resultData;
        var uri = GenerateUri(query, ApiPath);
        try
        {
            var result = await GetJson<ApiCharacterStatistics>(uri, useLastModified: false, timer: timer);
            if (result.NotModified)
            {
                LogNotModified();
                return;
            }

            resultData = result.Data;
        }
        catch (HttpRequestException e)
        {
            Logger.Error("HTTP {0}", e.Message);
            return;
        }

        // Fetch character data
        var pcStatistics = await Context.PlayerCharacterStatistics.FindAsync(query.CharacterId);
        if (pcStatistics == null)
        {
            pcStatistics = new PlayerCharacterStatistics
            {
                CharacterId = query.CharacterId,
            };
            Context.PlayerCharacterStatistics.Add(pcStatistics);
        }

        timer.AddPoint("Select");

        // Parse API data
        List<ApiCharacterStatisticsStatistic> statistics = new();
        foreach (var dataCategory in resultData.Categories.EmptyIfNull())
        {
            RecurseCategory(statistics, dataCategory);
        }

        var sortedStatistics = statistics
            .Where(stat => stat.Quantity > 0)
            .OrderBy(stat => stat.Id)
            .ToArray();
        
        var statisticIds = sortedStatistics
            .Select(stat => stat.Id)
            .ToList();
        var statisticQuantities = sortedStatistics
            .Select(stat => (int)stat.Quantity)
            .ToList();
        var statisticDescriptions = sortedStatistics
            .Select(stat => stat.Description)
            .ToList();

        if (pcStatistics.StatisticIds == null || !statisticIds.SequenceEqual(pcStatistics.StatisticIds))
        {
            pcStatistics.StatisticIds = statisticIds;
        }

        if (pcStatistics.StatisticQuantities == null || !statisticQuantities.SequenceEqual(pcStatistics.StatisticQuantities))
        {
            pcStatistics.StatisticQuantities = statisticQuantities;
        }

        if (pcStatistics.StatisticDescriptions == null || !statisticDescriptions.SequenceEqual(pcStatistics.StatisticDescriptions))
        {
            pcStatistics.StatisticDescriptions = statisticDescriptions;
        }

        timer.AddPoint("Process");

        var updated = await Context.SaveChangesAsync();
        if (updated > 0)
        {
            await CacheService.SetLastModified(RedisKeys.UserLastModifiedAchievements, query.UserId);
        }

        timer.AddPoint("Update", true);
        Logger.Debug("{Timer}", timer.ToString());
    }

    private static void RecurseCategory(
        List<ApiCharacterStatisticsStatistic> statistics,
        ApiCharacterStatisticsCategory category
    )
    {
        foreach (var subCategory in category.SubCategories.EmptyIfNull())
        {
            RecurseCategory(statistics, subCategory);
        }

        if (category.Statistics != null)
        {
            statistics.AddRange(category.Statistics);
        }
    }
}
