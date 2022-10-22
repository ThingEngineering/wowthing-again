using System.Text.Json.Serialization;

namespace Wowthing.Backend.Models.API.Data;

public class ApiDataMythicKeystonePeriod
{
    public int Id { get; set; }

    [JsonProperty("start_timestamp")]
    [JsonPropertyName("start_timestamp")]
    public long StartTimestamp { get; set; }

    [JsonProperty("end_timestamp")]
    [JsonPropertyName("end_timestamp")]
    public long EndTimestamp { get; set; }
}
