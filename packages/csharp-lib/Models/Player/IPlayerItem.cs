namespace Wowthing.Lib.Models.Player;

public interface IPlayerItem
{
    public int ItemId { get; set; }
    public int Count { get; set; }

    public short Context { get; set; }
    public short CraftedQuality { get; set; }
    public short EnchantId { get; set; }
    public short ItemLevel { get; set; }
    public short Quality { get; set; }
    public short SuffixId { get; set; }

    public List<short> BonusIds { get; set; }
    public List<int> Gems { get; set; }
    public Dictionary<int, int> Modifiers { get; set; }
}
