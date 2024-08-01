using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Wowthing.Lib.Converters;
using Wowthing.Lib.Enums;

namespace Wowthing.Lib.Models.Player;

[Index(nameof(GuildId), nameof(ItemId))]
[JsonConverter(typeof(PlayerGuildItemConverter))]
public class PlayerGuildItem : BasePlayerItem
{
    [Key]
    public long Id { get; set; }

    [ForeignKey("Guild")]
    public int GuildId { get; set; }
    public PlayerGuild Guild { get; set; }

    // Can't be specified as NotMapped in the base class as there's no way to remove it
    [NotMapped]
    public override ItemLocation Location => ItemLocation.GuildBank;
}
