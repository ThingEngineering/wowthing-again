using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Wowthing.Lib.Enums;
using Wowthing.Lib.Jobs;
using Wowthing.Lib.Models;
using Wowthing.Lib.Models.Wow;
using Wowthing.Lib.Utilities;

namespace Wowthing.Backend.Jobs.Magic;

public class MagicAggregateWorldQuestsJob : JobBase, IScheduledJob
{
    public static readonly ScheduledJob Schedule = new ScheduledJob
    {
        Type = JobType.MagicAggregateWorldQuests,
        Priority = JobPriority.High,
        Interval = TimeSpan.FromHours(1),
        Version = 1,
    };

    public override async Task Run(params string[] data)
    {
        var timer = new JankTimer();

        // (region, zoneId, questId) => data
        var aggregatedReports = new Dictionary<(short, int, int), QuestData>();
        foreach (var region in Enum.GetValues<WowRegion>())
        {
            var worldQuestQuery = Context.WorldQuestReport
                .AsNoTracking()
                .Where(wqr => wqr.Region == (short)region)
                .AsAsyncEnumerable();
            await foreach (var worldQuest in worldQuestQuery)
            {
                var zoneQuestKey = (worldQuest.Region, worldQuest.ZoneId, worldQuest.QuestId);
                if (!aggregatedReports.TryGetValue(zoneQuestKey, out var questData))
                {
                    questData = aggregatedReports[zoneQuestKey] = new();
                }

                questData.Count++;

                questData.Expirations.TryGetValue(worldQuest.ExpiresAt, out int expiresCount);
                questData.Expirations[worldQuest.ExpiresAt] = expiresCount + 1;

                questData.Locations.TryGetValue(worldQuest.Location, out int locationCount);
                questData.Locations[worldQuest.Location] = locationCount + 1;

                string rewardString = string.Join("|",
                    worldQuest.Rewards
                        .OrderBy(reward => reward[0])
                        .ThenBy(reward => reward[1])
                        .ThenBy(reward => reward[2])
                        .Select(reward => $"{reward[0]}-{reward[1]}-{reward[2]}")
                );
                if (!questData.Rewards.TryGetValue(rewardString, out Dictionary<string, int> rewardMap))
                {
                    rewardMap = questData.Rewards[rewardString] = new();
                }

                string factionClassKey = $"{worldQuest.Faction}-{worldQuest.Class}";
                rewardMap.TryGetValue(factionClassKey, out int factionClassCount);
                rewardMap[factionClassKey] = factionClassCount + 1;
            }
        }

        timer.AddPoint("Reports");

        var aggregateMap = await Context.WorldQuestAggregate
            .ToDictionaryAsync(wqa => (wqa.Region, wqa.ZoneId, wqa.QuestId));

        var questIds = new HashSet<int>();
        var seen = new HashSet<(short, int, int)>();

        foreach (var (questKey, questData) in aggregatedReports)
        {
            if (!aggregateMap.TryGetValue(questKey, out var aggregate))
            {
                aggregate = aggregateMap[questKey] = new WorldQuestAggregate
                {
                    Region = questKey.Item1,
                    ZoneId = questKey.Item2,
                    QuestId = questKey.Item3,
                };
                Context.WorldQuestAggregate.Add(aggregate);
            }

            questIds.Add(aggregate.QuestId);
            seen.Add(questKey);

            aggregate.JsonData = System.Text.Json.JsonSerializer.Serialize(questData, JsonSerializerOptions);
        }

        foreach (var (questKey, aggregate) in aggregateMap)
        {
            if (!seen.Contains(questKey))
            {
                Context.WorldQuestAggregate.Remove(aggregate);
            }
        }

        timer.AddPoint("Aggregates");

        // Blizzard API claims that none of the quests exist, cool
        // var existingQuestIds = (
        //     await Context.WowQuest
        //         .Select(q => q.Id)
        //         .ToArrayAsync()
        // ).ToHashSet();
        //
        // int[] newQuestIds = questIds.Except(existingQuestIds).ToArray();
        // foreach (int questId in newQuestIds)
        // {
        //     Context.WowQuest.Add(new WowQuest(questId));
        // }

        await Context.SaveChangesAsync();

        timer.AddPoint("Save");
        timer.Stop();

        Logger.Information("{timer}", timer.ToString());

        /*foreach (var (zoneQuestKey, zoneQuestData) in aggregatedReports)
        {
            Logger.Information($"region={zoneQuestKey.Item1} zone={zoneQuestKey.Item2} quest={zoneQuestKey.Item3} count={zoneQuestData.Count}");

            Logger.Information("Expirations:");
            foreach (var (expiration, expirationCount) in zoneQuestData.Expirations)
            {
                Logger.Information("- {expiration} x{count}", expiration, expirationCount);
            }

            Logger.Information("Locations:");
            foreach (var (location, locationCount) in zoneQuestData.Locations)
            {
                Logger.Information("- {location} x{count}", location, locationCount);
            }

            Logger.Information("Rewards:");
            foreach (var (rewardString, rewardMap) in zoneQuestData.Rewards)
            {
                int totalCount = rewardMap.Sum(kvp => kvp.Value);
                Logger.Information("- {reward} x{count}", rewardString, totalCount);
                foreach (var (factionClassKey, count) in rewardMap)
                {
                    Logger.Information("-- faction={faction} class={class} x{count}",
                        factionClassKey.Item1, factionClassKey.Item2, count);
                }
            }
        }*/
    }

    private class QuestData
    {
        public int Count { get; set; }
        public Dictionary<DateTime, int> Expirations { get; } = new();
        public Dictionary<string, int> Locations { get; } = new();
        public Dictionary<string, Dictionary<string, int>> Rewards { get; } = new();
    }
}
