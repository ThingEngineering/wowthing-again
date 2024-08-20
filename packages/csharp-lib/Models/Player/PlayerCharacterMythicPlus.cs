using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Wowthing.Lib.Converters;

namespace Wowthing.Lib.Models.Player;

public class PlayerCharacterMythicPlus
{
    [Key, ForeignKey("Character")]
    public int CharacterId { get; set; }
    public PlayerCharacter Character { get; set; }

    public int CurrentPeriodId { get; set; }

    [Column(TypeName = "jsonb")]
    public List<PlayerCharacterMythicPlusRun> PeriodRuns { get; set; }
}

public class PlayerCharacterMythicPlusRun
{
    public List<int> Affixes { get; set; }
    public DateTime Completed { get; set; }
    public int DungeonId { get; set; }
    public int Duration { get; set; }
    public int KeystoneLevel { get; set; }
    public bool Timed { get; set; }

    [JsonIgnore]
    public List<PlayerCharacterMythicPlusRunMember> Members { get; set; }
}

[JsonConverter(typeof(PlayerCharacterMythicPlusRunMemberConverter))]
public class PlayerCharacterMythicPlusRunMember
{
    public int ItemLevel { get; set; }
    public string Name { get; set; }
    public int RealmId { get; set; }
    public int SpecializationId { get; set; }
}
