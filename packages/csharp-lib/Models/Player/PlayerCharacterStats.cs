using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Wowthing.Lib.Enums;

namespace Wowthing.Lib.Models.Player;

public class PlayerCharacterStats
{
    [Key, ForeignKey("Character")]
    public int CharacterId { get; set; }
    public PlayerCharacter Character { get; set; }

    [Column(TypeName = "jsonb")]
    public Dictionary<WowItemStatType, PlayerCharacterStatsBasic> Basic { get; set; }

    [Column(TypeName = "jsonb")]
    public Dictionary<WowItemStatType, int> Misc { get; set; }

    [Column(TypeName = "jsonb")]
    public Dictionary<WowItemStatType, PlayerCharacterStatsRating> Rating { get; set; }
}

public class PlayerCharacterStatsBasic
{
    public int Base { get; set; }
    public int Effective { get; set; }
}

public class PlayerCharacterStatsRating
{
    public int Rating { get; set; }
    public int RatingBonus { get; set; }
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public int? Value { get; set; }
}
