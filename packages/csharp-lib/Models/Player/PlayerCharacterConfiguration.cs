using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Wowthing.Lib.Models.Player;

public class PlayerCharacterConfiguration
{
    [Key, ForeignKey("Character")]
    public int CharacterId { get; set; }
    public PlayerCharacter Character { get; set; }

    public short BackgroundId { get; set; }
    public short BackgroundBrightness { get; set; }
    public short BackgroundSaturation { get; set; }
}
