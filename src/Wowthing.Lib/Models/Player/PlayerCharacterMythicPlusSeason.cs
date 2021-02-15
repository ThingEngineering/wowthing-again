using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Wowthing.Lib.Models
{
    public class PlayerCharacterMythicPlusSeason
    {
        [ForeignKey("Character")]
        public int CharacterId { get; set; }
        public PlayerCharacter Character { get; set; }

        public int Season { get; set; }
        
        [Column(TypeName = "jsonb")]
        public List<PlayerCharacterMythicPlusRun> Runs { get; set; }
    }
}
