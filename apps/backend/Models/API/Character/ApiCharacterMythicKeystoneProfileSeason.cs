namespace Wowthing.Backend.Models.API.Character;

public class ApiCharacterMythicKeystoneProfileSeason
{
    [JsonPropertyName("best_runs")]
    public List<ApiCharacterMythicKeystoneBestRun> BestRuns { get; set; }
}
