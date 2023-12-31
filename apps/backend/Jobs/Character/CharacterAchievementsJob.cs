using System.Net.Http;
using Wowthing.Backend.Models.API.Character;
using Wowthing.Lib.Jobs;
using Wowthing.Lib.Models.Player;
using Wowthing.Lib.Utilities;

namespace Wowthing.Backend.Jobs.Character;

public class CharacterAchievementsJob : JobBase
{
    private const string ApiPath = "profile/wow/character/{0}/{1}/achievements";

    public override async Task Run(string[] data)
    {
        var query = DeserializeCharacterQuery(data[0]);
        using var shrug = CharacterLog(query);

        var timer = new JankTimer();

        // Fetch API data
        ApiCharacterAchievements resultData;
        var uri = GenerateUri(query, ApiPath);
        try
        {
            var result = await GetJson<ApiCharacterAchievements>(uri, useLastModified: false, timer: timer);
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
        var pcAchievements = await Context.PlayerCharacterAchievements.FindAsync(query.CharacterId);
        if (pcAchievements == null)
        {
            pcAchievements = new PlayerCharacterAchievements
            {
                CharacterId = query.CharacterId,
            };
            Context.PlayerCharacterAchievements.Add(pcAchievements);
        }

        timer.AddPoint("Select");

        // Parse API data
        var cheevs = new Dictionary<int, int>();
        var criteria = new Dictionary<int, (long, bool)>();
        foreach (var dataAchievement in resultData.Achievements.EmptyIfNull())
        {
            if (dataAchievement.CompletedTimestamp.HasValue)
            {
                // Blizzard provides timestamps with 000 milliseconds for some reason
                cheevs[dataAchievement.Id] = (int)(dataAchievement.CompletedTimestamp / 1000);
            }

            if (dataAchievement.Criteria != null)
            {
                criteria[dataAchievement.Criteria.Id] = (
                    (long)(dataAchievement.Criteria.Amount ?? 0),
                    dataAchievement.Criteria.IsCompleted
                );
            }

            RecurseCriteria(criteria, dataAchievement.Criteria?.ChildCriteria);
        }

        var sortedAchievements = cheevs
            .OrderBy(kvp => kvp.Key)
            .ToArray();
        var achievementIds = sortedAchievements
            .Select(kvp => kvp.Key)
            .ToList();
        var achievementTimestamps = sortedAchievements
            .Select(kvp => kvp.Value)
            .ToList();

        if (pcAchievements.AchievementIds == null || !achievementIds.SequenceEqual(pcAchievements.AchievementIds))
        {
            pcAchievements.AchievementIds = achievementIds;
        }

        if (pcAchievements.AchievementTimestamps == null || !achievementTimestamps.SequenceEqual(pcAchievements.AchievementTimestamps))
        {
            pcAchievements.AchievementTimestamps = achievementTimestamps;
        }

        var sortedCriteria = criteria
            .Where(kvp => kvp.Value.Item2 || kvp.Value.Item1 > 0)
            .OrderBy(kvp => kvp.Key)
            .ToArray();
        var criteriaIds = sortedCriteria
            .Select(kvp => kvp.Key)
            .ToList();
        var criteriaAmounts = sortedCriteria
            .Select(kvp => kvp.Value.Item1)
            .ToList();
        var criteriaCompleted = sortedCriteria
            .Select(kvp => kvp.Value.Item2)
            .ToList();

        if (pcAchievements.CriteriaIds == null || !criteriaIds.SequenceEqual(pcAchievements.CriteriaIds))
        {
            pcAchievements.CriteriaIds = criteriaIds;
        }

        if (pcAchievements.CriteriaAmounts == null || !criteriaAmounts.SequenceEqual(pcAchievements.CriteriaAmounts))
        {
            pcAchievements.CriteriaAmounts = criteriaAmounts;
        }

        if (pcAchievements.CriteriaCompleted == null || !criteriaCompleted.SequenceEqual(pcAchievements.CriteriaCompleted))
        {
            pcAchievements.CriteriaCompleted = criteriaCompleted;
        }

        timer.AddPoint("Process");

        var updated = await Context.SaveChangesAsync();
        if (updated > 0)
        {
            await JobRepository.AddJobAsync(JobPriority.High, JobType.UserCacheAchievements, query.UserId.ToString());
        }

        timer.AddPoint("Update", true);
        Logger.Debug("{Timer}", timer.ToString());
    }

    private static void RecurseCriteria(Dictionary<int, (long, bool)> criteriaAmounts, List<ApiCharacterAchievementsCriteriaChild> childCriteria)
    {
        foreach (var child in childCriteria.EmptyIfNull())
        {
            criteriaAmounts[child.Id] = (
                (long)(child.Amount ?? 0),
                child.IsCompleted
            );
            RecurseCriteria(criteriaAmounts, child.ChildCriteria);
        }
    }
}
