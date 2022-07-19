using Wowthing.Backend.Models.Data.Achievements;

namespace Wowthing.Backend.Models.Redis;

public class RedisStaticAchievements
{
    public List<OutAchievementCategory> Categories { get; set; }
        
    public List<OutAchievement> AchievementRaw { get; set; }
    public List<OutCriteria> CriteriaRaw { get; set; }
    public List<OutCriteriaTree> CriteriaTreeRaw { get; set; }
}