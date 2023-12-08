using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Wowthing.Lib.Converters;

namespace Wowthing.Lib.Models.Player;

[Index(nameof(GuildId), nameof(ItemId))]
[System.Text.Json.Serialization.JsonConverter(typeof(PlayerGuildItemConverter))]
public class PlayerGuildItem : IPlayerItem
{
    // Fields are ordered from largest to smallest for database table size reasons. Postgres doesn't go
    // smaller than a short (2 bytes), sadly.
    [Key]
    public long Id { get; set; }

    [ForeignKey("Guild")]
    public int GuildId { get; set; }
    public PlayerGuild Guild { get; set; }

    public int ItemId { get; set; }
    public int Count { get; set; }

    public short TabId { get; set; }
    public short Slot { get; set; }

    public short Context { get; set; }
    public short CraftedQuality { get; set; }
    public short EnchantId { get; set; }
    public short ItemLevel { get; set; }
    public short Quality { get; set; }
    public short SuffixId { get; set; }

    public List<short> BonusIds { get; set; }
    public List<int> Gems { get; set; }

    [Column(TypeName = "jsonb")]
    public Dictionary<int, int> Modifiers { get; set; }
}
