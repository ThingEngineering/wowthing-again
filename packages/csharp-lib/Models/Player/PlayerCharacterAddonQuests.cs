﻿using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Wowthing.Lib.Constants;

namespace Wowthing.Lib.Models.Player
{
    public class PlayerCharacterAddonQuests
    {
        [Key, ForeignKey("Character")]
        public int CharacterId { get; set; }
        public PlayerCharacter Character { get; set; }

        public DateTime CallingsScannedAt { get; set; } = MiscConstants.DefaultDateTime;
        public DateTime QuestsScannedAt { get; set; } = MiscConstants.DefaultDateTime;
        
        public List<int> DailyQuests { get; set; }
        public List<int> OtherQuests { get; set; }

        [Column(TypeName = "jsonb")]
        public Dictionary<int, List<List<int>>> Dailies { get; set; }
        
        [Column(TypeName = "jsonb")]
        public Dictionary<string, PlayerCharacterAddonQuestsProgress> ProgressQuests { get; set; }
    }

    public class PlayerCharacterAddonQuestsProgress
    {
        public int Expires { get; set; }
        public int Have { get; set; }
        public int Id { get; set; }
        public int Need { get; set; }
        public int Status { get; set; }
        public string Name { get; set; }
        public string Text { get; set; }
        public string Type { get; set; }
    }
}
