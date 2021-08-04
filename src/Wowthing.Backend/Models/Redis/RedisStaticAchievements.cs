using System.Collections.Generic;
using Wowthing.Backend.Models.Data;

namespace Wowthing.Backend.Models.Redis
{
    public class RedisStaticAchievements
    {
        public Dictionary<int, OutAchievement> Achievements { get; set; }
        public List<OutAchievementCategory> Categories { get; set; }
    }
}