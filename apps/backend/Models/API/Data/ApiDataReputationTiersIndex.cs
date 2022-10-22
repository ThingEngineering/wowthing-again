using System.Text.Json.Serialization;

namespace Wowthing.Backend.Models.API.Data;

public class ApiDataReputationTiersIndex
{
    [JsonProperty("reputation_tiers")]
    [JsonPropertyName("reputation_tiers")]
    public List<ApiObnoxiousObject> Tiers { get; set; }
}
