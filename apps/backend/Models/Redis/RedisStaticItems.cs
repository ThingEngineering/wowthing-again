namespace Wowthing.Backend.Models.Redis;

public class RedisStaticItems
{
    [JsonProperty("rawItems")]
    public RedisStaticItemsItem[] Items { get; set; }
}
