using Wowthing.Lib.Models.Wow;

namespace Wowthing.Tool.Models.Items;

public class RedisItems
{
    public WowItemBonus[] RawItemBonuses { get; set; }
    public Dictionary<int, Dictionary<int, List<int>>> ItemBonusListGroups { get; set; }
    public RedisItemData[]? RawItems { get; set; }
}
