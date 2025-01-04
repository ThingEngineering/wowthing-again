using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Wowthing.Lib.Constants;

namespace Wowthing.Lib.Models.Player;

public class PlayerCharacterWeekly(int characterId)
{
    [Key, ForeignKey("Character")]
    [JsonIgnore]
    public int CharacterId { get; set; } = characterId;

    [JsonIgnore]
    public PlayerCharacter Character { get; set; }

    public List<int> DelveLevels { get; set; }
    public List<string> DelveMaps { get; set; }
    public int DelveWeek { get; set; }

    public DateTime KeystoneScannedAt { get; set; } = MiscConstants.DefaultDateTime;
    public int KeystoneDungeon { get; set; }
    public int KeystoneLevel { get; set; }

    public DateTime TorghastScannedAt { get; set; } = MiscConstants.DefaultDateTime;

    [Column(TypeName = "jsonb")]
    public Dictionary<string, int> Torghast { get; set; }

    [Column(TypeName = "jsonb")]
    public PlayerCharacterWeeklyVault Vault { get; set; } = new();
}

public class PlayerCharacterWeeklyVault
{
    public DateTime ScannedAt { get; set; }
    public bool AvailableRewards { get; set; }
    public bool GeneratedRewards { get; set; }
    public bool HasRewards { get; set; }

    public List<List<int>> MythicPlusRuns { get; set; }

    public List<PlayerCharacterWeeklyVaultProgress> MythicPlusProgress { get; set; }
    public List<PlayerCharacterWeeklyVaultProgress> RaidProgress { get; set; }
    public List<PlayerCharacterWeeklyVaultProgress> WorldProgress { get; set; }
    // public List<PlayerCharacterWeeklyVaultProgress> RankedPvpProgress { get; set; }
}

public class PlayerCharacterWeeklyUghQuest
{
    public int? Have { get; set; }
    public int? Need { get; set; }
    public int Status { get; set; }
    public string Text { get; set; }
    public string Type { get; set; }
}

public class PlayerCharacterWeeklyVaultProgress
{
    public int Level { get; set; }
    public int Progress { get; set; }
    public int Threshold { get; set; }
    public int Tier { get; set; }

    public List<PlayerCharacterItem> Rewards { get; set; } = new();
}
