using Wowthing.Lib.Enums;
using Wowthing.Lib.Models.Player;

namespace Wowthing.Web.Models.Search;

public class ItemSearchResponseWarbank
{
    public WowRegion Region { get; set; }

    public short Tab { get; set; }
    public short Slot { get; set; }
    public int Count { get; set; }
    public short Context { get; set; }
    public short EnchantId { get; set; }
    public short ItemLevel { get; set; }
    public short Quality { get; set; }
    public short SuffixId { get; set; }
    public List<short> BonusIds { get; set; }
    public List<int> Gems { get; set; }

    public ItemSearchResponseWarbank(PlayerWarbankItem item)
    {
        Region = item.Region;

        Tab = item.ContainerId;
        Slot = item.Slot;
        Count = item.Count;
        Context = item.Context;
        EnchantId = item.EnchantId;
        ItemLevel = item.ItemLevel;
        Quality = item.Quality;
        SuffixId = item.SuffixId;
        BonusIds = item.BonusIds;
        Gems = item.Gems;
    }
}
