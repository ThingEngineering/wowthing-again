using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Wowthing.Lib.Models.Player
{
    public class PlayerCharacterAddonQuests
    {
        [Key, ForeignKey("Character")]
        public int CharacterId { get; set; }
        public PlayerCharacter Character { get; set; }

        public DateTime CallingsScannedAt { get; set; } = DateTime.MinValue;
        public DateTime QuestsScannedAt { get; set; } = DateTime.MinValue;
        
        public List<bool> CallingCompleted { get; set; }
        public List<int> CallingExpires { get; set; }
        
        public List<int> DailyQuests { get; set; }
        public List<int> OtherQuests { get; set; }
        
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
