using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Wowthing.Lib.Constants;

namespace Wowthing.Lib.Models.Player;

public class PlayerCharacterAddonMounts
{
    [Key, ForeignKey("Character")]
    public int CharacterId { get; set; }
    public PlayerCharacter Character { get; set; }

    public DateTime ScannedAt { get; set; } = MiscConstants.DefaultDateTime;

    public List<int> Mounts { get; set; }

    public PlayerCharacterAddonMounts(PlayerCharacter character)
    {
        CharacterId = character.Id;
    }
}
