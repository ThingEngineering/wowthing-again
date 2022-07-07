using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Wowthing.Lib.Models.Player
{
    public class PlayerCharacterAchievements
    {
        [Key, ForeignKey("Character")]
        public int CharacterId { get; set; }
        public PlayerCharacter Character { get; set; }
        
        public List<int> AchievementIds { get; set; }
        public List<int> AchievementTimestamps { get; set; }
        public List<int> CriteriaIds { get; set; }
        public List<long> CriteriaAmounts { get; set; }
        public List<bool> CriteriaCompleted { get; set; }
    }
}
