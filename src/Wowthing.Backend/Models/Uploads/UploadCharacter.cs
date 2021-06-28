using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

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

        public Dictionary<int, List<int>> Currencies { get; set; }
        // lockouts
        public UploadCharacterMythicDungeon[] MythicDungeons { get; set; }
        public Dictionary<string, int> ScanTimes { get; set; }
        public List<UploadCharacterTorghast> Torghast { get; set; }
        public UploadCharacterVault[][] Vault { get; set; }
        public Dictionary<string, UploadWeeklyUghQuest> WeeklyUghQuests { get; set; }
    }

    public class UploadCharacterMythicDungeon
    {
        public int Level { get; set; }
        public int Map { get; set; }
    }

    public class UploadCharacterTorghast
    {
        public int Level { get; set; }
        public string Name { get; set; }
    }
}
