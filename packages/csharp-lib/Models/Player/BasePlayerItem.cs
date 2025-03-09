using System.ComponentModel.DataAnnotations.Schema;
using Wowthing.Lib.Converters;
using Wowthing.Lib.Enums;

namespace Wowthing.Lib.Models.Player;

[JsonConverter(typeof(BasePlayerItemConverter))]
public abstract class BasePlayerItem
{
    public int ItemId { get; set; }
    public int Count { get; set; }

    public short ContainerId { get; set; }
    public short Slot { get; set; }

    public short BindType { get; set; }
    public short Context { get; set; }
    public short CraftedQuality { get; set; }
    public short EnchantId { get; set; }
    public short ItemLevel { get; set; }
    public short Quality { get; set; }
    public short SuffixId { get; set; }

    public bool Bound { get; set; }

    public List<short> BonusIds { get; set; }
    public List<int> Gems { get; set; }

    [Column(TypeName = "jsonb")]
    public Dictionary<int, int> Modifiers { get; set; }

    public virtual ItemLocation Location
    {
        get => throw new NotImplementedException();
        set => throw new NotImplementedException();
    }
}
