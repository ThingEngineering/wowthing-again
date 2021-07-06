using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Wowthing.Lib.Models.Player
{
    public class PlayerCharacterAchievements
    {
        [Key, ForeignKey("Character")]
        public int CharacterId { get; set; }
        public PlayerCharacter Character { get; set; }

        [Column(TypeName = "jsonb")]
        public Dictionary<int, int> AchievementTimestamps { get; set; }

        [Column(TypeName = "jsonb")]
        public Dictionary<int, long> CriteriaAmounts { get; set; }
    }
}
