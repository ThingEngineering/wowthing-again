using Wowthing.Lib.Enums;
using Wowthing.Lib.Models.Player;

namespace Wowthing.Web.Models.Search;

public class ItemSearchResponseCharacter
{
    public ItemLocation Location { get; set; }

    public int CharacterId { get; set; }
    public int Count { get; set; }
    public short BindType { get; set; }
    public short Context { get; set; }
    public short EnchantId { get; set; }
    public short ItemLevel { get; set; }
    public short Quality { get; set; }
    public short SuffixId { get; set; }
    public bool Bound { get; set; }
    public List<short> BonusIds { get; set; }
    public List<int> Gems { get; set; }

    public ItemSearchResponseCharacter()
    {
    }

    public ItemSearchResponseCharacter(BasePlayerItem item)
    {
        BindType = item.BindType;
        Bound = item.Bound;
        Count = item.Count;
        Context = item.Context;
        EnchantId = item.EnchantId;
        ItemLevel = item.ItemLevel;
        Quality = item.Quality;
        SuffixId = item.SuffixId;
        BonusIds = item.BonusIds;
        Gems = item.Gems;

        Location = item.Location;
    }
}
