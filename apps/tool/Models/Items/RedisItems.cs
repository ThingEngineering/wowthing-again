namespace Wowthing.Tool.Models.Items;

public class RedisItems
{
    public Dictionary<int, Dictionary<int, List<int>>> ItemBonusListGroups { get; set; }
    public RedisItemData[]? RawItems { get; set; }
}
