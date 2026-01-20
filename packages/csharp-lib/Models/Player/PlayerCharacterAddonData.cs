using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Wowthing.Lib.Constants;
using Wowthing.Lib.Converters;

namespace Wowthing.Lib.Models.Player;

public class PlayerCharacterAddonData(int characterId)
{
    [Key, ForeignKey("Character")]
    public int CharacterId { get; set; } = characterId;

    public PlayerCharacter Character { get; set; }

    public short Level { get; set; }
    public int LevelXp { get; set; }

    public string BindLocation { get; set; }
    public string CurrentLocation { get; set; }

    public DateTime DailyReset { get; set; } = MiscConstants.DefaultDateTime;
    public DateTime WeeklyReset { get; set; } = MiscConstants.DefaultDateTime;

    public DateTime BagsScannedAt { get; set; } = MiscConstants.DefaultDateTime;
    public DateTime BankScannedAt { get; set; } = MiscConstants.DefaultDateTime;
    public DateTime CurrenciesScannedAt { get; set; } = MiscConstants.DefaultDateTime;
    public DateTime CurrenciesTransferredAt { get; set; } = MiscConstants.DefaultDateTime;
    public DateTime GarrisonTreesScannedAt { get; set; } = MiscConstants.DefaultDateTime;
    public DateTime MythicPlusScannedAt { get; set; } = MiscConstants.DefaultDateTime;
    public DateTime PatronOrdersScannedAt { get; set; } = MiscConstants.DefaultDateTime;

    public List<int> KnownSpells { get; set; } = new();

    [Column(TypeName = "jsonb")]
    public Dictionary<int, PlayerCharacterAddonDataAura> Auras { get; set; } = new();

    [Column(TypeName = "jsonb")]
    public Dictionary<int, PlayerCharacterAddonDataCurrency> Currencies { get; set; } = new();

    [Column(TypeName = "jsonb")]
    public Dictionary<int, PlayerCharacterEquippedItem> EquippedItems { get; set; } = new();

    [Column(TypeName = "jsonb")]
    public Dictionary<int, PlayerCharacterAddonDataGarrison> Garrisons { get; set; } = new();

    [Column(TypeName = "jsonb")]
    public Dictionary<int, Dictionary<int, List<int>>> GarrisonTrees { get; set; } = new();

    [Column(TypeName = "jsonb")]
    public Dictionary<int, int> HighestItemLevel { get; set; } = new();

    [Column(TypeName = "jsonb")]
    public Dictionary<int, PlayerCharacterAddonDataMythicPlus> MythicPlus { get; set; } = new();

    [Column(TypeName = "jsonb")]
    public Dictionary<int, Dictionary<int, PlayerCharacterAddonDataMythicPlusMap>> MythicPlusSeasons { get; set; } = new();

    [Column(TypeName = "jsonb")]
    public Dictionary<int, List<PlayerCharacterAddonDataMythicPlusRun>> MythicPlusWeeks { get; set; } = new();

    [Column(TypeName = "jsonb")]
    public Dictionary<int, List<PlayerCharacterAddonDataPatronOrder>> PatronOrders { get; set; } = new();

    [Column(TypeName = "jsonb")]
    public Dictionary<int, PlayerCharacterProfessionTier> Professions { get; set; } = new();

    [Column(TypeName = "jsonb")]
    public Dictionary<string, List<int>> ProfessionCooldowns { get; set; } = new();

    [Column(TypeName = "jsonb")]
    public Dictionary<int, Dictionary<int, int>> ProfessionTraits { get; set; } = new();
}

public class PlayerCharacterAddonDataAura
{
    public int Duration { get; set; }
    public int Expires { get; set; }
    public int Stacks { get; set; }
}

[JsonConverter(typeof(PlayerCharacterAddonDataCurrencyConverter))]
public class PlayerCharacterAddonDataCurrency
{
    public int Quantity { get; set; }
    public int Max { get; set; }
    public int WeekQuantity { get; set; }
    public int WeekMax { get; set; }
    public int TotalQuantity { get; set; }

    public short CurrencyId { get; set; }

    public bool IsWeekly { get; set; }
    public bool IsMovingMax { get; set; }
}

public class PlayerCharacterAddonDataGarrison
{
    public int Level { get; set; }
    public int Type { get; set; }
    public DateTime ScannedAt { get; set; }
    public List<PlayerCharacterAddonDataGarrisonBuilding> Buildings { get; set; }
}

public class PlayerCharacterAddonDataGarrisonBuilding
{
    public int BuildingId { get; set; }
    public int PlotId { get; set; }
    public int Rank { get; set; }
    public string Name { get; set; }
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

public class PlayerCharacterAddonDataPatronOrder
{
    public int ExpirationTime { get; set; }
    public int ItemId { get; set; }
    public int MinQuality { get; set; }
    public int SkillLineAbilityId { get; set; }
    public int TipAmount { get; set; }

    public List<PlayerCharacterAddonDataPatronOrderReagent> Reagents { get; set; }
    public List<PlayerCharacterAddonDataPatronOrderReward> Rewards { get; set; }
}

public class PlayerCharacterAddonDataPatronOrderReagent
{
    public int Count { get; set; }
    public int ItemId { get; set; }
}

public class PlayerCharacterAddonDataPatronOrderReward
{
    public int Count { get; set; }
    public int ItemId { get; set; }
}
