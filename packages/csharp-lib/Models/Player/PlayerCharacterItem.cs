using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Wowthing.Lib.Converters;
using Wowthing.Lib.Enums;

namespace Wowthing.Lib.Models.Player;

[Index(nameof(CharacterId), nameof(ItemId), nameof(Location))]
[Index(nameof(CharacterId), nameof(Slot))]
[JsonConverter(typeof(PlayerCharacterItemConverter))]
public class PlayerCharacterItem : BasePlayerItem
{
    [Key]
    public long Id { get; set; }

    [ForeignKey("Character")]
    public int CharacterId { get; set; }
    public PlayerCharacter Character { get; set; }

    public override ItemLocation Location { get; set; }
}
