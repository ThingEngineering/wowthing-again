// ReSharper disable InconsistentNaming

using Wowthing.Backend.Converters;

namespace Wowthing.Backend.Models.Uploads;

public class UploadCharacter
{
    public bool IsResting { get; set; }
    public bool IsWarMode { get; set; }
    public bool VaultAvailableRewards { get; set; }
    public bool VaultGeneratedRewards { get; set; }
    public bool VaultHasRewards { get; set; }
    public short DelvesGilded { get; set; }
    public int ActiveCovenantId { get; set; }
    public int ChromieTime { get; set; }
    public int DailyReset { get; set; }
    public int KeystoneInstance { get; set; }
    public int KeystoneLevel { get; set; }
    public int LastSeen { get; set; }
    public int WeeklyReset { get; set; }
    public short Level { get; set; }
    public int LevelXp { get; set; }
    public int PlayedTotal { get; set; }
    public int RestedXp { get; set; }
    public long Copper { get; set; }
    public string BindLocation { get; set; }
    public string CurrentLocation { get; set; }
    public string GuildName { get; set; }

    public string CompletedQuestsSquish { get; set; }
    public string TransmogSquish { get; set; }

    public List<UploadCharacterAchievement> Achievements { get; set; }
    public List<int> Auras { get; set; }
    public List<string> AurasV2 { get; set; }
    public Dictionary<string, int> Bags { get; set; }
    public List<UploadCharacterCalling> Callings { get; set; }
    public List<UploadCharacterCovenant> Covenants { get; set; }
    public Dictionary<short, string> Currencies { get; set; }
    public Dictionary<int, List<string>> Delves { get; set; }
    public Dictionary<int, List<UploadCharacterEmissary>> Emissaries { get; set; }
    public Dictionary<string, string> EquipmentV2 { get; set; }
    public List<UploadCharacterGarrison> Garrisons { get; set; }
    public Dictionary<string, string[]> GarrisonTrees { get; set; }
    public List<string> HighestItemLevel { get; set; }
    public List<UploadCharacterInstanceDone> InstanceDone { get; set; }
    public Dictionary<string, Dictionary<string, string>> Items { get; set; }
    public List<int> KnownSpells { get; set; }
    public List<UploadCharacterLockout> Lockouts { get; set; }
    public List<int> Mounts { get; set; }
    public UploadCharacterMythicDungeon[] MythicDungeons { get; set; }
    public UploadCharacterMythicPlus MythicPlus { get; set; }
    public UploadCharacterMythicPlusV2 MythicPlusV2 { get; set; }
    public Dictionary<int, string> Paragons { get; set; }
    public Dictionary<int, string[]> PatronOrders { get; set; }
    public List<UploadCharacterProfession> Professions { get; set; }
    public List<string> ProfessionCooldowns { get; set; }
    public List<string> ProfessionOrders { get; set; }
    public List<string> ProfessionTraits { get; set; }
    public Dictionary<int, int> Reputations { get; set; }
    public Dictionary<string, int> ScanTimes { get; set; }
    public string Transmog { get; set; }

    public List<int> DailyQuests { get; set; }
    public List<int> OtherQuests { get; set; }
    public List<string> ProgressQuests { get; set; }
    public Dictionary<short, Dictionary<int, string[]>> WorldQuests { get; set; }

    [JsonConverter(typeof(DefaultOnErrorConverter<Dictionary<string, UploadCharacterVault[]>>))]
    public Dictionary<string, UploadCharacterVault[]> Vault { get; set; }
}

public class UploadCharacterAchievement
{
    public bool Earned { get; set; }
    public int Id { get; set; }
    public List<int> Criteria { get; set; }
}

public class UploadCharacterCalling
{
    public bool Completed { get; set; }
    public int Expires { get; set; }
    public int QuestID { get; set; }
}

public class UploadCharacterEmissary : UploadCharacterCalling
{
    public UploadCharacterEmissaryReward Reward { get; set; }
}

public class UploadCharacterEmissaryReward
{
    public int CurrencyID { get; set; }
    public int ItemID { get; set; }
    public int Money { get; set; }
    public int Quality { get; set; }
    public int Quantity { get; set; }
}

public class UploadCharacterCovenant
{
    public int Anima { get; set; }
    public int Id { get; set; }
    public int Renown { get; set; }
    public int Souls { get; set; }
    public UploadCharacterCovenantFeature Conductor { get; set; }
    public UploadCharacterCovenantFeature Missions { get; set; }
    public UploadCharacterCovenantFeature Transport { get; set; }
    public UploadCharacterCovenantFeature Unique { get; set; }
    public List<UploadCharacterCovenantSoulbind> Soulbinds { get; set; }
}

public class UploadCharacterCovenantFeature
{
    public int Rank { get; set; }
    public int? ResearchEnds { get; set; }
    public string Name { get; set; }
}

public class UploadCharacterCovenantSoulbind
{
    public int Id { get; set; }
    public bool Unlocked { get; set; }
    public List<int> Specs { get; set; }
    public List<List<int>> Tree { get; set; }
}

public class UploadCharacterGarrison
{
    public int Level { get; set; }
    public int ScannedAt { get; set; }
    public int Type { get; set; }
    public List<UploadCharacterGarrisonBuilding> Buildings { get; set; }
}

public class UploadCharacterGarrisonBuilding
{
    public int BuildingId { get; set; }
    public int PlotId { get; set; }
    public int Rank { get; set; }
    public string Name { get; set; }
}

public class UploadCharacterInstanceDone
{
    public bool Locked { get; set; }
    public int ResetTime { get; set; }
    public string Key { get; set; }
}

public class UploadCharacterLockout
{
    public bool Locked { get; set; }
    public int DefeatedBosses { get; set; }
    public int Difficulty { get; set; }
    public int Id { get; set; }
    public int MaxBosses { get; set; }
    public int ResetTime { get; set; }
    public string Name { get; set; }
    public List<string> Bosses { get; set; }
}

public class UploadCharacterMythicDungeon
{
    public int Level { get; set; }
    public int Map { get; set; }
}

public class UploadCharacterMythicPlus
{
    public int Season { get; set; }
    public List<UploadCharacterMythicPlusMap> Maps { get; set; }
    public List<string> Runs { get; set; }
}

public class UploadCharacterMythicPlusV2
{
    public Dictionary<int, List<UploadCharacterMythicPlusMap>> Seasons { get; set; }
    public Dictionary<int, List<string>> Weeks { get; set; }
}

public class UploadCharacterMythicPlusMap
{
    public List<UploadCharacterMythicPlusMapScore> AffixScores { get; set; }
    public int MapId { get; set; }
    public int OverallScore { get; set; }
}

public class UploadCharacterMythicPlusMapScore
{
    public bool OverTime { get; set; }
    public int DurationSec { get; set; }
    public int Level { get; set; }
    public int Score { get; set; }
    public string Name { get; set; }
}

public class UploadCharacterProfession
{
    public int Id { get; set; }
    public int CurrentSkill { get; set; }
    public int MaxSkill { get; set; }
    public List<int> KnownRecipes { get; set; }
}

public class UploadCharacterTorghast
{
    public int Level { get; set; }
    public string Name { get; set; }
}
