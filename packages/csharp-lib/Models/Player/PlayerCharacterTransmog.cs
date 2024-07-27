using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Wowthing.Lib.Models.Player;

public class PlayerCharacterTransmog
{
    [Key, ForeignKey("Character")]
    public int CharacterId { get; set; }
    public PlayerCharacter Character { get; set; }

    public List<int> IllusionIds { get; set; }
    public List<int> TransmogIds { get; set; }

    public PlayerCharacterTransmog(PlayerCharacter character)
    {
        CharacterId = character.Id;
    }
}
