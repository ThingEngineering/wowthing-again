using System.Text.Json.Serialization;

namespace Wowthing.Backend.Models.API.Data;

public class ApiDataConnectedRealmIndex
{
    [JsonProperty("connected_realms")]
    [JsonPropertyName("connected_realms")]
    public List<ApiObnoxiousHref> ConnectedRealms { get; set; }
}
