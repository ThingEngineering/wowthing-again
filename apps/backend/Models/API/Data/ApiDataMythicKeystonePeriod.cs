namespace Wowthing.Backend.Models.API.Data;

public class ApiDataMythicKeystonePeriod
{
    public int Id { get; set; }

    [JsonPropertyName("start_timestamp")]
    public long StartTimestamp { get; set; }

    [JsonPropertyName("end_timestamp")]
    public long EndTimestamp { get; set; }
}
