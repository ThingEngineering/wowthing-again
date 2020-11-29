using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Wowthing.Lib.Models
{
    public class PlayerCharacterShadowlands
    {
        [Key, ForeignKey("Character")]
        public long CharacterId { get; set; }

        public PlayerCharacter Character { get; set; }

        // Covenants
        public int CovenantId { get; set; }
        public int RenownLevel { get; set; }
        public int SoulbindId { get; set; }
        public List<int> ConduitIds { get; set; }
        public List<int> ConduitRanks { get; set; }
    }
}
