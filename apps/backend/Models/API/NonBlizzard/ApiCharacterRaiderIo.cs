namespace Wowthing.Backend.Models.API.NonBlizzard;

public class ApiCharacterRaiderIo
{
    [JsonPropertyName("mythic_plus_scores_by_season")]
    public List<ApiCharacterRaiderIoSeason> ScoresBySeason { get; set; }
}

public class ApiCharacterRaiderIoSeason
{
    public static readonly Dictionary<string, int> SeasonMap = new Dictionary<string, int>
    {
        { "season-bfa-1", 1 },
        { "season-bfa-2", 2 },
        { "season-bfa-3", 3 },
        { "season-bfa-4", 4 },
        { "season-sl-1", 5 },
        { "season-sl-2", 6 },
        { "season-sl-3", 7 },
        { "season-sl-4", 8 },
        { "season-df-1", 9 },
        { "season-df-2", 10 },
        { "season-df-3", 11 },
        { "season-df-4", 12 },
        { "season-tww-1", 13 },
        { "season-tww-2", 14 },
        { "season-tww-3", 15 },
        { "season-tww-3-legion-remix", 1001 },
    };

    public string Season { get; set; }
    public Dictionary<string, decimal> Scores { get; set; }

    public int SeasonId => SeasonMap[Season];
    public decimal ScoreAll => Scores.GetValueOrDefault("all");
    public decimal ScoreDps => Scores.GetValueOrDefault("dps");
    public decimal ScoreHealer => Scores.GetValueOrDefault("healer");
    public decimal ScoreTank => Scores.GetValueOrDefault("tank");
    public decimal ScoreSpec1 => Scores.GetValueOrDefault("spec_0");
    public decimal ScoreSpec2 => Scores.GetValueOrDefault("spec_1");
    public decimal ScoreSpec3 => Scores.GetValueOrDefault("spec_2");
    public decimal ScoreSpec4 => Scores.GetValueOrDefault("spec_3");
}
