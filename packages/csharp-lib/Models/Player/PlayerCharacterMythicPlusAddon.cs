using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Wowthing.Lib.Models.Player;

public class PlayerCharacterMythicPlusAddon
{
    [Key, ForeignKey("Character")]
    [JsonIgnore]
    public int CharacterId { get; set; }
    [JsonIgnore]
    public PlayerCharacter Character { get; set; }

    public int Season { get; set; }

    [Column(TypeName = "jsonb")]
    public Dictionary<int, PlayerCharacterMythicPlusAddonMap> Maps { get; set; }
}

public class PlayerCharacterMythicPlusAddonMap
{
    public int OverallScore { get; set; }
    public PlayerCharacterMythicPlusAddonMapScore FortifiedScore { get; set; }
    public PlayerCharacterMythicPlusAddonMapScore TyrannicalScore { get; set; }
}

public class PlayerCharacterMythicPlusAddonMapScore
{
    public bool OverTime { get; set; }
    public int DurationSec { get; set; }
    public int Level { get; set; }
    public int Score { get; set; }
}
