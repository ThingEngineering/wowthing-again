using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Wowthing.Lib.Models.Player;

public class PlayerCharacterStatistics
{
    [Key, ForeignKey("Character")]
    public int CharacterId { get; set; }
    public PlayerCharacter Character { get; set; }

    public List<int> StatisticIds { get; set; }
    public List<int> StatisticQuantities { get; set; }
    public List<string> StatisticDescriptions { get; set; }
}
