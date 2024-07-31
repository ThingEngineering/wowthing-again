using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Wowthing.Lib.Converters;
using Wowthing.Lib.Enums;

namespace Wowthing.Lib.Models.Player;

[Index(nameof(CharacterId), nameof(ItemId), nameof(Location))]
[Index(nameof(CharacterId), nameof(Slot))]
[JsonConverter(typeof(PlayerCharacterItemConverter))]
public class PlayerCharacterItem : IPlayerItem
{
    // Fields are ordered from largest to smallest for database table size reasons. Postgres doesn't go
    // smaller than a short (2 bytes), sadly.
    [Key]
    public long Id { get; set; }

    [ForeignKey("Character")]
    public int CharacterId { get; set; }
    public PlayerCharacter Character { get; set; }

    public int ItemId { get; set; }
    public int Count { get; set; }

    public ItemLocation Location { get; set; }
    public short BagId { get; set; }
    public short Slot { get; set; }

    public short Context { get; set; }
    public short CraftedQuality { get; set; }
    public short EnchantId { get; set; }
    public short ItemLevel { get; set; }
    public short Quality { get; set; }
    public short SuffixId { get; set; }

    public List<int> Gems { get; set; }
    public List<short> BonusIds { get; set; }

    [Column(TypeName = "jsonb")]
    public Dictionary<int, int> Modifiers { get; set; }
}
