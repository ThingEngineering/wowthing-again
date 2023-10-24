using Wowthing.Lib.Models.Wow;

namespace Wowthing.Tool.Models.Items;

public class RedisItems
{
    public short[][] ClassIdSubclassIdInventoryTypes { get; set; }
    public int[] ClassMasks { get; set; }
    public long[] RaceMasks { get; set; }
    public string[] Names { get; set; }
    public List<int> OppositeFactionIds { get; set; }

    public Dictionary<int, List<int>> CompletesQuest { get; set; }
    public Dictionary<short, int[]> CraftingQualities { get; set; }
    public Dictionary<int, Dictionary<int, List<int>>> ItemBonusListGroups { get; set; }
    public Dictionary<short, int[]> ItemConversionEntries { get; set; }
    public Dictionary<short, int[]> LimitCategories { get; set; }
    public Dictionary<int, int> TeachesSpell { get; set; }

    public RedisItemData[]? RawItems { get; set; }
    public WowItemBonus[] RawItemBonuses { get; set; }
    public RedisItemSet[] RawItemSets { get; set; }
}
