using System.Text.Json.Serialization;

namespace Wowthing.Backend.Models.API.Data;

public class ApiDataTitle
{
    public int Id { get; set; }
    public string Name { get; set; }

    [JsonProperty("gender_name")]
    [JsonPropertyName("gender_name")]
    public ApiGenderString GenderName { get; set; }
}
