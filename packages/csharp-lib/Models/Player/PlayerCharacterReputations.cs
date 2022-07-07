using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Wowthing.Lib.Models.Player
{
    public class PlayerCharacterReputations
    {
        [Key, ForeignKey("Character")]
        public int CharacterId { get; set; }
        public PlayerCharacter Character { get; set; }

        public List<int> ReputationIds { get; set; }
        public List<int> ReputationValues { get; set; }

        public List<int> ExtraReputationIds { get; set; }
        public List<int> ExtraReputationValues { get; set; }
        
        [Column(TypeName = "jsonb")]
        public Dictionary<int, PlayerCharacterReputationsParagon> Paragons { get; set; }
    }

    public class PlayerCharacterReputationsParagon
    {
        public bool RewardAvailable { get; set; }
        public int Current { get; set; }
        public int Max { get; set; }
        public int Received { get; set; }
    }
}
