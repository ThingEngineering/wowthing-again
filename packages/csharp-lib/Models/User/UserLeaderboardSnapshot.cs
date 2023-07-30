using System.ComponentModel.DataAnnotations.Schema;

namespace Wowthing.Lib.Models.User;

[Index(nameof(UserId), nameof(Date), IsDescending = new[] { false, true })]
public class UserLeaderboardSnapshot
{
    // 8 * 1 = 8
    [ForeignKey("User")]
    public long UserId { get; set; }
    public ApplicationUser User { get; set; }

    // 4 * 1 = 4
    public DateOnly Date { get; set; }

    // 4 * 6 = 24
    public int AchievementPointsAlliance { get; set; }
    public int AchievementPointsHorde { get; set; }
    public int AchievementPointsOverall { get; set; }
    public int AppearanceIdCount { get; set; }
    public int AppearanceSourceCount { get; set; }
    public int CompletedQuestCount { get; set; }

    // 2 * 8 = 16
    public short HeirloomCount { get; set; }
    public short HeirloomLevels { get; set; }
    public short IllusionCount { get; set; }
    public short MountCount { get; set; }
    public short PetCount { get; set; }
    public short RecipeCount { get; set; }
    public short ReputationCount { get; set; }
    public short TitleCount { get; set; }
    public short ToyCount { get; set; }

    public UserLeaderboardSnapshot(long userId)
    {
        UserId = userId;
    }
}
