using System.Text.Json.Serialization;

namespace Wowthing.Backend.Models.API.Data;

public class ApiDataReputationFaction
{
    public int Id { get; set; }
    public string Name { get; set; }

    [JsonProperty("reputation_tiers")]
    [JsonPropertyName("reputation_tiers")]
    public ApiObnoxiousObject Tiers { get; set; }
}
