using Wowthing.Lib.Enums;
using Wowthing.Lib.Jobs;
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

        foreach (var region in Enum.GetValues<WowRegion>())
        {
            // (zoneId, questId) => (faction, class, rewardString) => count
            var regionData = new Dictionary<(int, int), QuestData>();

            var worldQuestQuery = Context.WorldQuestReport
                .AsNoTracking()
                .Where(wqr => wqr.Region == (short)region)
                .AsAsyncEnumerable();
            await foreach (var worldQuest in worldQuestQuery)
            {
                var zoneQuestKey = (worldQuest.ZoneId, worldQuest.QuestId);
                if (!regionData.TryGetValue(zoneQuestKey, out var questData))
                {
                    questData = regionData[zoneQuestKey] = new();
                }

                questData.Count++;

                questData.Locations.TryGetValue(worldQuest.Location, out int locationCount);
                questData.Locations[worldQuest.Location] = locationCount + 1;

                string rewardString = string.Join("|",
                    worldQuest.Rewards
                        .OrderBy(reward => reward[0])
                        .ThenBy(reward => reward[1])
                        .ThenBy(reward => reward[2])
                        .Select(reward => $"{reward[0]}-{reward[1]}-{reward[2]}")
                );
                if (!questData.Rewards.TryGetValue(rewardString, out var rewardMap))
                {
                    rewardMap = questData.Rewards[rewardString] = new();
                }

                var factionClassKey = (worldQuest.Faction, worldQuest.Class);
                rewardMap.TryGetValue(factionClassKey, out int factionClassCount);
                rewardMap[factionClassKey] = factionClassCount + 1;
            }

            foreach (var (zoneQuestKey, zoneQuestData) in regionData)
            {
                Logger.Information($"zone={zoneQuestKey.Item1} quest={zoneQuestKey.Item2} count={zoneQuestData.Count}");
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
            }
        }

        timer.AddPoint("Aggregate");

        timer.Stop();

        Logger.Information("{timer}", timer.ToString());
    }

    private class QuestData
    {
        public int Count = 0;
        public readonly Dictionary<string, int> Locations = new();
        public readonly Dictionary<string, Dictionary<(short, short), int>> Rewards = new();
    }
}
