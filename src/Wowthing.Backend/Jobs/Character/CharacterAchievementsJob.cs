using Wowthing.Backend.Models.API.Character;
using Wowthing.Lib.Models.Player;
using Wowthing.Lib.Models.Query;
using Wowthing.Lib.Utilities;

namespace Wowthing.Backend.Jobs.Character
{
    public class CharacterAchievementsJob : JobBase
    {
        private const string ApiPath = "profile/wow/character/{0}/{1}/achievements";

        public override async Task Run(params string[] data)
        {
            var query = JsonConvert.DeserializeObject<SchedulerCharacterQuery>(data[0]);
            using var shrug = CharacterLog(query);

            var timer = new JankTimer();

            // Fetch API data
            var uri = GenerateUri(query, ApiPath);
            var result = await GetJson<ApiCharacterAchievements>(uri, timer: timer);
            if (result.NotModified)
            {
                LogNotModified();
                return;
            }

            // Fetch character data
            var achievements = await Context.PlayerCharacterAchievements.FindAsync(query.CharacterId);
            if (achievements == null)
            {
                achievements = new PlayerCharacterAchievements
                {
                    CharacterId = query.CharacterId,
                };
                Context.PlayerCharacterAchievements.Add(achievements);
            }
            
            timer.AddPoint("Select");

            // Parse API data
            var cheevs = new Dictionary<int, int>();
            var criteria = new Dictionary<int, (long, bool)>();
            foreach (var dataAchievement in result.Data.Achievements.EmptyIfNull())
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
                .Select(kvp => kvp.Key)
                .ToList();
            
            if (!achievementIds.SequenceEqual(achievements.AchievementIds))
            {
                achievements.AchievementIds = achievementIds;
            }

            if (!achievementTimestamps.SequenceEqual(achievements.AchievementTimestamps))
            {
                achievements.AchievementTimestamps = achievementTimestamps;
            }
            
            var sortedCriteria = criteria
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

            if (!criteriaIds.SequenceEqual(achievements.CriteriaIds))
            {
                achievements.CriteriaIds = criteriaIds;
            }

            if (!criteriaAmounts.SequenceEqual(achievements.CriteriaAmounts))
            {
                achievements.CriteriaAmounts = criteriaAmounts;
            }

            if (!criteriaCompleted.SequenceEqual(achievements.CriteriaCompleted))
            {
                achievements.CriteriaCompleted = criteriaCompleted;
            }
            
            timer.AddPoint("Process");
            
            var updated = await Context.SaveChangesAsync();
            if (updated > 0)
            {
                var db = Redis.GetDatabase();
                await db.KeyDeleteAsync($"data_cache:{query.UserId}:achievements");
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
}
