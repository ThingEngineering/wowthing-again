using System.Collections.Generic;
using Newtonsoft.Json;

namespace Wowthing.Backend.Models.API.Character
{
    public class ApiCharacterAchievements
    {
        public List<ApiCharacterAchievementsAchievement> Achievements { get; set; }
    }

    public class ApiCharacterAchievementsAchievement
    {
        public int Id { get; set; }
        
        [JsonProperty("completed_timestamp")]
        public long? CompletedTimestamp { get; set; }

        public ApiCharacterAchievementsCriteria Criteria { get; set; }
    }

    public class ApiCharacterAchievementsCriteria
    {
        public int Id { get; set; }
        public ulong? Amount { get; set; }

        [JsonProperty("is_completed")]
        public bool IsCompleted { get; set; }

        [JsonProperty("child_criteria")]
        public List<ApiCharacterAchievementsCriteriaChild> ChildCriteria { get; set; }
    }

    public class ApiCharacterAchievementsCriteriaChild
    {
        public int Id { get; set; }
        public ulong? Amount { get; set; }

        [JsonProperty("is_completed")]
        public bool IsCompleted { get; set; }

        [JsonProperty("child_criteria")]
        public List<ApiCharacterAchievementsCriteriaChild> ChildCriteria { get; set; }
    }
}
