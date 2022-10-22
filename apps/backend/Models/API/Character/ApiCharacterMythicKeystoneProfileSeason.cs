using System.Text.Json.Serialization;

namespace Wowthing.Backend.Models.API.Character;

public class ApiCharacterMythicKeystoneProfileSeason
{
    [JsonProperty("best_runs")]
    [JsonPropertyName("best_runs")]
    public List<ApiCharacterMythicKeystoneBestRun> BestRuns { get; set; }
}
