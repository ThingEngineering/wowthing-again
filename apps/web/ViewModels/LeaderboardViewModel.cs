namespace Wowthing.Web.ViewModels;

public class LeaderboardViewModel
{
    public readonly string LeaderboardJson;
    public readonly string SettingsJson;

    public LeaderboardViewModel(string leaderboardJson, string settingsJson)
    {
        LeaderboardJson = leaderboardJson;
        SettingsJson = settingsJson;
    }
}
