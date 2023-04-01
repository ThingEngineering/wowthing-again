namespace Wowthing.Tool.Models.Achievements;

public class RedisAchievements
{
    public List<OutAchievementCategory> Categories { get; set; }

    public List<OutAchievement> AchievementRaw { get; set; }
    public List<OutCriteria> CriteriaRaw { get; set; }
    public List<OutCriteriaTree> CriteriaTreeRaw { get; set; }
    public int[] HideIds { get; set; }
}
