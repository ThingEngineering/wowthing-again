using System;
using System.Collections.Generic;

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
        public string DailyQuestsPacked { get; set; }
        public string OtherQuestsPacked { get; set; }
        public string QuestsPacked { get; set; } 
        public string WeeklyQuestsPacked { get; set; }
    }
}
