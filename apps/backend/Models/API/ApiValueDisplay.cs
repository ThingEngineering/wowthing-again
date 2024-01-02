namespace Wowthing.Backend.Models.API;

public class ApiValueDisplay
{
    public int Value { get; set; }

    [JsonPropertyName("display_string")]
    public string DisplayString { get; set; }
}
