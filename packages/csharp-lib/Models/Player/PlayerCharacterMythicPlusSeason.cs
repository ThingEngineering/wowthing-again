using System.ComponentModel.DataAnnotations.Schema;

namespace Wowthing.Lib.Models.Player;

public class PlayerCharacterMythicPlusSeason
{
    [ForeignKey("Character")]
    public int CharacterId { get; set; }
    public PlayerCharacter Character { get; set; }

    public int Season { get; set; }
    public double Rating { get; set; }

    [Column(TypeName = "jsonb")]
    public List<PlayerCharacterMythicPlusRun> Runs { get; set; }
}
