using System.Collections.Generic;

namespace Wowthing.Web.Models
{
    public class UserAchievementData
    {
        public Dictionary<int, int> Achievements { get; set; }
        public Dictionary<int, List<int[]>> Criteria { get; set; }
    }
}
