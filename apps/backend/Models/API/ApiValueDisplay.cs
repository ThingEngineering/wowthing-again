using System.Text.Json.Serialization;

namespace Wowthing.Backend.Models.API;

public class ApiValueDisplay
{
    public int Value { get; set; }

    [JsonProperty("display_string")]
    [JsonPropertyName("display_string")]
    public string DisplayString { get; set; }
}
