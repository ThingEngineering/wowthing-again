using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Wowthing.Lib.Models.Player;

public class PlayerCharacterMedia
{
    [Key, ForeignKey("Character")]
    public int CharacterId { get; set; }
    public PlayerCharacter Character { get; set; }

    public string AvatarUrl { get; set; }
    public string InsetUrl { get; set; }
    public string MainUrl { get; set; }
    public string MainRawUrl { get; set; }
}
