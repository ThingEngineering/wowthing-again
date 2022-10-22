using System.Text.Json.Serialization;

namespace Wowthing.Backend.Models.API;

public class ApiAccessToken
{
    [JsonProperty("access_token")]
    [JsonPropertyName("access_token")]
    public string AccessToken { get; set; }

    [JsonProperty("expires_in")]
    [JsonPropertyName("expires_in")]
    public int ExpiresIn { get; set; }

    [JsonProperty("scope")]
    [JsonPropertyName("scope")]
    public string Scope { get; set; }

    [JsonProperty("token_type")]
    [JsonPropertyName("token_type")]
    public string TokenType { get; set; }
}
