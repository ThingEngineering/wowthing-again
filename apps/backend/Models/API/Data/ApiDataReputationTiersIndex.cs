namespace Wowthing.Backend.Models.API.Data;

public class ApiDataReputationTiersIndex
{
    [JsonProperty("reputation_tiers")]
    public List<ApiObnoxiousObject> Tiers { get; set; }
}