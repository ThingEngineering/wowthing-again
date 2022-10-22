using System.Text.Json.Serialization;

namespace Wowthing.Backend.Models.Redis;

public class RedisStaticItems
{
    [JsonProperty("rawItems")]
    [JsonPropertyName("rawItems")]
    public RedisStaticItemsItem[] Items { get; set; }
}
