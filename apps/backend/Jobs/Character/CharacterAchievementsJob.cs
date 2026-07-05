using System.Net.Http;
using Wowthing.Backend.Models.API.Character;
using Wowthing.Lib.Constants;
using Wowthing.Lib.Models.Player;
using Wowthing.Lib.Models.Query;
using Wowthing.Lib.Utilities;

namespace Wowthing.Backend.Jobs.Character;

public class CharacterAchievementsJob : JobBase
{
    private const string ApiPath = "profile/wow/character/{0}/{1}/achievements";

    private SchedulerCharacterQuery _query;

    public override void Setup(string[] data)
    {
        _query = DeserializeCharacterQuery(data[0]);
        CharacterLog(_query);
    }

    public override async Task Run(string[] data)
    {
        var timer = new JankTimer();

        if (_query?.AccountId == null)
        {
            throw new InvalidDataException("AccountId is null");
        }

        int accountId = _query.AccountId.Value;

        string lockKey = string.Format(RedisKeys.AccountAchievements, accountId);
        string lockValue = Guid.NewGuid().ToString("N");
        try
        {
            // Attempt to get exclusive scheduler lock
            bool lockSuccess = await JobRepository.AcquireLockAsync(lockKey, lockValue, TimeSpan.FromMinutes(1));
            if (!lockSuccess)
            {
                Logger.Debug("Skipping achievements, lock failed");
                return;
            }
        }
        catch (Exception ex)
        {
            Logger.Error(ex, "Kaboom!");
            return;
        }

        // Fetch API data
        ApiCharacterAchievements resultData;
        var uri = GenerateUri(_query, ApiPath);
        try
        {
            var result = await GetUriAsJsonAsync<ApiCharacterAchievements>(uri, useLastModified: false, timer: timer);
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

        // Fetch account data
        var paAchievements = await Context.PlayerAccountAchievements.FindAsync(accountId);
        if (paAchievements == null)
        {
            paAchievements = new PlayerAccountAchievements
            {
                AccountId = accountId,
            };
            Context.PlayerAccountAchievements.Add(paAchievements);
        }

        // Fetch character data
        var pcAchievements = await Context.PlayerCharacterAchievements.FindAsync(_query.CharacterId);
        if (pcAchievements == null)
        {
            pcAchievements = new PlayerCharacterAchievements
            {
                CharacterId = _query.CharacterId,
            };
            Context.PlayerCharacterAchievements.Add(pcAchievements);
        }

        timer.AddPoint("Select");

        // Parse API data
        var cheevs = new Dictionary<int, int>();
        var criteria = new Dictionary<int, (long, bool)>();

        if (paAchievements.CompressedAchievementIds != null)
        {
            var currentAchievements = SerializationUtilities.DeserializeFromBitmap(paAchievements.CompressedAchievementIds);
            for (int i = 0; i < currentAchievements.Count; i++)
            {
                cheevs[currentAchievements[i]] = paAchievements.AchievementTimestamps[i];
            }
        }

        foreach (var dataAchievement in resultData.Achievements.EmptyIfNull())
        {
            if (dataAchievement.CompletedTimestamp.HasValue)
            {
                // Blizzard provides timestamps with 000 milliseconds for some reason
                int newTimestamp = (int)(dataAchievement.CompletedTimestamp / 1000);
                // Only use this value if it's new or earlier than the existing
                cheevs[dataAchievement.Id] = Math.Min(cheevs.GetValueOrDefault(dataAchievement.Id, int.MaxValue), newTimestamp);
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

        // Achievements go in account data
        var sortedAchievements = cheevs
            .OrderBy(kvp => kvp.Key)
            .ToArray();
        var achievementIds = sortedAchievements
            .Select(kvp => kvp.Key)
            .ToList();
        var achievementTimestamps = sortedAchievements
            .Select(kvp => kvp.Value)
            .ToList();

        byte[] compressedAchievementIds = SerializationUtilities.SerializeToBitmap(achievementIds);

        if (paAchievements.CompressedAchievementIds == null || !compressedAchievementIds.SequenceEqual(paAchievements.CompressedAchievementIds))
        {
            paAchievements.CompressedAchievementIds = compressedAchievementIds;
        }

        if (paAchievements.AchievementTimestamps == null || !achievementTimestamps.SequenceEqual(paAchievements.AchievementTimestamps))
        {
            paAchievements.AchievementTimestamps = achievementTimestamps;
        }

        // Criteria go in character data
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

        byte[] compressedCriteriaIds = SerializationUtilities.SerializeToBitmap(criteriaIds);

        if (pcAchievements.CompressedCriteriaIds == null || !compressedCriteriaIds.SequenceEqual(pcAchievements.CompressedCriteriaIds))
        {
            pcAchievements.CriteriaIds = null;
            pcAchievements.CompressedCriteriaIds = compressedCriteriaIds;
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

        int updated = await Context.SaveChangesAsync(CancellationToken);
        if (updated > 0)
        {
            await CacheService.DeleteAchievementCacheAsync(_query.UserId);
            await CacheService.SetLastModified(RedisKeys.UserLastModifiedAchievements, _query.UserId);
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

    public override async Task Finally()
    {
        await DecrementCharacterJobs();
    }
}
