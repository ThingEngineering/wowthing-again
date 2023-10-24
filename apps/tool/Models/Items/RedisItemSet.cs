using Wowthing.Tool.Converters.Items;

namespace Wowthing.Tool.Models.Items;

[JsonConverter(typeof(RedisItemSetConverter))]
public class RedisItemSet
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int[] ItemIds { get; set; }

    public RedisItemSet(DumpItemSet set)
    {
        Id = set.ID;
        ItemIds = set.ItemIDs;
        Name = set.Name;
    }
}
