using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Wowthing.Lib.Models.Player;

public class PlayerCharacterTransmog(int characterId)
{
    [Key, ForeignKey("Character")]
    public int CharacterId { get; set; } = characterId;

    public PlayerCharacter Character { get; set; }

    public List<int> IllusionIds { get; set; }
    public List<int> TransmogIds { get; set; }
}
