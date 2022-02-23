using System;
using System.Collections.Generic;
using Newtonsoft.Json;
using Wowthing.Lib.Models.Player;

namespace Wowthing.Web.Models
{
    public class UserQuestData
    {
        public Dictionary<int, UserQuestDataCharacter> Characters { get; set; }
    }

    public class UserQuestDataCharacter
    {
        public DateTime ScannedAt { get; set; }
        public List<bool> CallingCompleted { get; set; }
        public List<int> CallingExpires { get; set; }
        
        public List<int> DailyQuestList { get; set; }
        public List<int> QuestList { get; set; }
        
        public Dictionary<string, PlayerCharacterAddonQuestsProgress> ProgressQuests { get; set; }
    }
}
