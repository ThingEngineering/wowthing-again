using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Wowthing.Lib.Models.Player;

public class PlayerCharacterAddonData
{
    [Key, ForeignKey("Character")]
    public int CharacterId { get; set; }
    public PlayerCharacter Character { get; set; }
   
    public DateTime GarrisonTreesScannedAt { get; set; } = DateTime.MinValue;

    [Column(TypeName = "jsonb")]
    public Dictionary<int, Dictionary<int, List<int>>> GarrisonTrees { get; set; }
}
