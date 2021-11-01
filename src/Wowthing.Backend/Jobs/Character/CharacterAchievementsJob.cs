using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Wowthing.Backend.Models.API;
using Wowthing.Backend.Models.API.Character;
using Wowthing.Lib.Extensions;
using Wowthing.Lib.Models.Player;
using Wowthing.Lib.Models.Query;

namespace Wowthing.Backend.Jobs.Character
{
    public class CharacterAchievementsJob : JobBase
    {
        private const string ApiPath = "profile/wow/character/{0}/{1}/achievements";

        public override async Task Run(params string[] data)
        {
            var query = JsonConvert.DeserializeObject<SchedulerCharacterQuery>(data[0]);
            using var shrug = CharacterLog(query);

            // Fetch API data
            var uri = GenerateUri(query, ApiPath);
            var result = await GetJson<ApiCharacterAchievements>(uri);
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

            achievements.AchievementIds = new List<int>();
            achievements.AchievementTimestamps = new List<int>();

            // Parse API data
            var criteria = new Dictionary<int, (long, bool)>();
            foreach (var dataAchievement in result.Data.Achievements.EmptyIfNull())
            {
                if (dataAchievement.CompletedTimestamp.HasValue)
                {
                    // Blizzard provides timestamps with 000 milliseconds for some reason
                    achievements.AchievementIds.Add(dataAchievement.Id);
                    achievements.AchievementTimestamps.Add((int)(dataAchievement.CompletedTimestamp / 1000));
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

            var sortedCriteria = criteria
                .OrderBy(kvp => kvp.Key)
                .ToArray();
            achievements.CriteriaIds = sortedCriteria
                .Select(kvp => kvp.Key)
                .ToList();
            achievements.CriteriaAmounts = sortedCriteria
                .Select(kvp => kvp.Value.Item1)
                .ToList();
            achievements.CriteriaCompleted = sortedCriteria
                .Select(kvp => kvp.Value.Item2)
                .ToList();

            await Context.SaveChangesAsync();
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
