namespace Wowthing.Tool.Models.Achievements;

public class RedisAchievements
{
    public List<OutAchievementCategory> Categories { get; set; } = new();

    public List<OutAchievement> AchievementRaw { get; set; } = new();
    public List<OutCriteria> CriteriaRaw { get; set; } = new();
    public List<OutCriteriaTree> CriteriaTreeRaw { get; set; } = new();
    public int[] HideIds { get; set; }
}
