using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Wowthing.Lib.Constants;

namespace Wowthing.Lib.Models.Player;

public class PlayerCharacterAddonData
{
    [Key, ForeignKey("Character")]
    public int CharacterId { get; set; }
    public PlayerCharacter Character { get; set; }

    public string BindLocation { get; set; }
    public string CurrentLocation { get; set; }

    public DateTime GarrisonTreesScannedAt { get; set; } = MiscConstants.DefaultDateTime;
    public DateTime MythicPlusScannedAt { get; set; } = MiscConstants.DefaultDateTime;

    [Column(TypeName = "jsonb")]
    public Dictionary<int, Dictionary<int, List<int>>> GarrisonTrees { get; set; }

    [Column(TypeName = "jsonb")]
    public Dictionary<int, PlayerCharacterAddonDataMythicPlus> MythicPlus { get; set; }
}

public class PlayerCharacterAddonDataMythicPlus
{
    public Dictionary<int, PlayerCharacterAddonDataMythicPlusMap> Maps { get; set; } = new();
    public List<PlayerCharacterAddonDataMythicPlusRun> Runs { get; set; } = new();
}

public class PlayerCharacterAddonDataMythicPlusMap
{
    public int OverallScore { get; set; }
    public PlayerCharacterAddonDataMythicPlusScore FortifiedScore { get; set; }
    public PlayerCharacterAddonDataMythicPlusScore TyrannicalScore { get; set; }
}

public class PlayerCharacterAddonDataMythicPlusScore
{
    public bool OverTime { get; set; }
    public int DurationSec { get; set; }
    public int Level { get; set; }
    public int Score { get; set; }
}

public class PlayerCharacterAddonDataMythicPlusRun
{
    public bool Completed { get; set; }
    public int Level { get; set; }
    public int MapId { get; set; }
    public int Score { get; set; }
}
