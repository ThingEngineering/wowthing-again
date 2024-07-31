using Wowthing.Lib.Models.User;

namespace Wowthing.Lib.Models.API;

public class ApiLeaderboard
{
    public string Username { get; set; }
    public bool LinkTo { get; set; }

    public int AchievementPointsAlliance { get; set; }
    public int AchievementPointsHorde { get; set; }
    public int AchievementPointsOverall { get; set; }
    public int AppearanceIdCount { get; set; }
    public int AppearanceSourceCount { get; set; }
    public int CompletedQuestCount { get; set; }

    public short HeirloomCount { get; set; }
    public short HeirloomLevels { get; set; }
    public short IllusionCount { get; set; }
    public short MountCount { get; set; }
    public short PetCount { get; set; }
    public short RecipeCount { get; set; }
    public short ReputationCount { get; set; }
    public short TitleCount { get; set; }
    public short ToyCount { get; set; }

    public ApiLeaderboard(string username, bool linkTo, UserLeaderboardSnapshot snapshot)
    {
        Username = username;
        LinkTo = linkTo;

        AchievementPointsAlliance = snapshot.AchievementPointsAlliance;
        AchievementPointsHorde = snapshot.AchievementPointsHorde;
        AchievementPointsOverall = snapshot.AchievementPointsOverall;
        AppearanceIdCount = snapshot.AppearanceIdCount;
        AppearanceSourceCount = snapshot.AppearanceSourceCount;
        CompletedQuestCount = snapshot.CompletedQuestCount;

        HeirloomCount = snapshot.HeirloomCount;
        HeirloomLevels = snapshot.HeirloomLevels;
        IllusionCount = snapshot.IllusionCount;
        MountCount = snapshot.MountCount;
        PetCount = snapshot.PetCount;
        RecipeCount = snapshot.RecipeCount;
        ReputationCount = snapshot.ReputationCount;
        TitleCount = snapshot.TitleCount;
        ToyCount = snapshot.ToyCount;
    }
}
