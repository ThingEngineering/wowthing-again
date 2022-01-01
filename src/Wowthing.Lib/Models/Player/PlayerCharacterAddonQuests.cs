using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Wowthing.Lib.Models.Player
{
    public class PlayerCharacterAddonQuests
    {
        [Key, ForeignKey("Character")]
        public int CharacterId { get; set; }
        public PlayerCharacter Character { get; set; }

        public DateTime ScannedAt { get; set; } = DateTime.MinValue;
        
        public List<bool> CallingCompleted { get; set; }
        public List<int> CallingExpires { get; set; }
        public List<int> DailyQuests { get; set; }
        public List<int> OtherQuests { get; set; }
        public List<int> WeeklyQuests { get; set; }
    }
}
