﻿using Wowthing.Lib.Models.Player;
using Wowthing.Lib.Models.Query;

namespace Wowthing.Web.Models
{
    public class UserAchievementData
    {
        public Dictionary<int, int> Achievements { get; set; }
        public Dictionary<int, List<int[]>> Criteria { get; set; }
        public Dictionary<int, Dictionary<int, PlayerCharacterAddonAchievementsAchievement>> AddonAchievements { get; set; }
        public Dictionary<int, StatisticsQuery[]> Statistics { get; set; }
    }
}
