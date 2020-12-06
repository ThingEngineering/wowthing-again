using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Wowthing.Lib.Models
{
    public class PlayerCharacterQuests
    {
        [Key, ForeignKey("Character")]
        public long CharacterId { get; set; }

        public PlayerCharacter Character { get; set; }

        public List<int> CompletedIds { get; set; }
    }
}
