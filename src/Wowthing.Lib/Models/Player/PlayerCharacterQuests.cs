using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Wowthing.Lib.Models.Player
{
    public class PlayerCharacterQuests
    {
        [Key, ForeignKey("Character")]
        public int CharacterId { get; set; }
        public PlayerCharacter Character { get; set; }

        public List<int> CompletedIds { get; set; }
    }
}
