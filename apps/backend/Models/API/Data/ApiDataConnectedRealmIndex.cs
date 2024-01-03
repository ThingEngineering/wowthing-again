namespace Wowthing.Backend.Models.API.Data;

public class ApiDataConnectedRealmIndex
{
    [JsonPropertyName("connected_realms")]
    public List<ApiObnoxiousHref> ConnectedRealms { get; set; }
}
