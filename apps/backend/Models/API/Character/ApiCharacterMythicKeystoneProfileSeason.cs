namespace Wowthing.Backend.Models.API.Character;

public class ApiCharacterMythicKeystoneProfileSeason
{
    [JsonPropertyName("best_runs")]
    public List<ApiCharacterMythicKeystoneBestRun> BestRuns { get; set; }

    [JsonPropertyName("mythic_rating")]
    public ApiCharacterMythicKeystoneProfileRating MythicRating { get; set; }
}

public class ApiCharacterMythicKeystoneProfileRating
{
    public double Rating { get; set; }
}

