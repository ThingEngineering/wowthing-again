using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Wowthing.Backend.Models.API;
using Wowthing.Backend.Models.API.Character;
using Wowthing.Lib.Extensions;
using Wowthing.Lib.Models;
using Wowthing.Lib.Models.Query;

namespace Wowthing.Backend.Jobs.Character
{
    public class CharacterAchievementsJob : JobBase
    {
        private const string API_PATH = "profile/wow/character/{0}/{1}/achievements";

        public override async Task Run(params string[] data)
        {
            var query = JsonConvert.DeserializeObject<SchedulerCharacterQuery>(data[0]);
            using var shrug = CharacterLog(query);

            // Fetch API data
            var path = string.Format(API_PATH, query.RealmSlug, query.CharacterName.ToLowerInvariant());
            var uri = GenerateUri(query.Region, ApiNamespace.Profile, path);

            var result = await GetJson<ApiCharacterAchievements>(uri);
            if (result.NotModified)
            {
                _logger.Information("304 Not Modified");
                return;
            }

            // Fetch character data
            var achievements = await _context.PlayerCharacterAchievements.FindAsync(query.CharacterId);
            if (achievements == null)
            {
                achievements = new PlayerCharacterAchievements
                {
                    CharacterId = query.CharacterId,
                };
                _context.PlayerCharacterAchievements.Add(achievements);
            }

            achievements.AchievementTimestamps = new Dictionary<int, int>();
            achievements.CriteriaAmounts = new Dictionary<int, long>();

            // Parse API data
            foreach (var dataAchievement in result.Data.Achievements.EmptyIfNull())
            {
                if (dataAchievement.CompletedTimestamp.HasValue)
                {
                    // Blizzard provides timestamps with 000 milliseconds for some reason
                    achievements.AchievementTimestamps[dataAchievement.Id] = (int)(dataAchievement.CompletedTimestamp / 1000);
                }

                if (dataAchievement.Criteria?.Amount.HasValue ?? false)
                {
                    achievements.CriteriaAmounts[dataAchievement.Criteria.Id] = (long)dataAchievement.Criteria.Amount.Value;
                }

                RecurseCriteria(achievements.CriteriaAmounts, dataAchievement.Criteria?.ChildCriteria);
            }

            await _context.SaveChangesAsync();
        }

        private static void RecurseCriteria(Dictionary<int, long> criteriaAmounts, List<ApiCharacterAchievementsCriteriaChild> childCriteria)
        {
            foreach (var child in childCriteria.EmptyIfNull())
            {
                if (child.Amount.HasValue)
                {
                    criteriaAmounts[child.Id] = (long)child.Amount.Value;
                }
                RecurseCriteria(criteriaAmounts, child.ChildCriteria);
            }
        }
    }
}
