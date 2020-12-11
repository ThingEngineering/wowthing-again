using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Wowthing.Lib.Models
{
    public class PlayerCharacterReputations
    {
        [Key, ForeignKey("Character")]
        public int CharacterId { get; set; }
        public PlayerCharacter Character { get; set; }

        public List<int> ReputationIds { get; set; }
        public List<int> ReputationValues { get; set; }
    }
}
