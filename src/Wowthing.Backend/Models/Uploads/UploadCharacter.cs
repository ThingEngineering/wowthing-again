using System.Collections.Generic;

namespace Wowthing.Backend.Models.Uploads
{
    public class UploadCharacter
    {
        public bool IsResting { get; set; }
        public bool IsWarMode { get; set; }
        public int ChromieTime { get; set; }
        public int FlightSpeed { get; set; }
        public int GroundSpeed { get; set; }
        public int KeystoneInstance { get; set; }
        public int KeystoneLevel { get; set; }
        public int LastSeen { get; set; }
        public int MountSkill { get; set; }
        public int PlayedTotal { get; set; }
        public int RestedXp { get; set; }
        public long Copper { get; set; }

        public List<UploadCharacterCurrency> Currencies { get; set; }
        public List<UploadCharacterLockout> Lockouts { get; set; }
        public UploadCharacterMythicDungeon[] MythicDungeons { get; set; }
        public UploadCharacterMythicPlus MythicPlus { get; set; }
        public List<UploadCharacterReputation> Reputations { get; set; }
        public Dictionary<string, int> ScanTimes { get; set; }
        public List<UploadCharacterTorghast> Torghast { get; set; }
        public List<int> Transmog { get; set; }
        public UploadCharacterVault[][] Vault { get; set; }
        public Dictionary<string, UploadWeeklyUghQuest> WeeklyUghQuests { get; set; }
    }

    public class UploadCharacterCurrency
    {
        public int Id { get; set; }
        public int Total { get; set; }
        public int MaxTotal { get; set; }
        public int Week { get; set; }
        public int MaxWeek { get; set; }
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
        public List<UploadCharacterLockoutBoss> Bosses { get; set; }
    }

    public class UploadCharacterLockoutBoss
    {
        public bool Dead { get; set; }
        public string Name { get; set; }
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

    public class UploadCharacterReputation
    {
        public int Id { get; set; }
        public int Value { get; set; }
    }

    public class UploadCharacterTorghast
    {
        public int Level { get; set; }
        public string Name { get; set; }
    }
}
