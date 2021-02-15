using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Wowthing.Lib.Models
{
    public class PlayerCharacterRaiderIo
    {
        [Key, ForeignKey("Character")]
        public int CharacterId { get; set; }
        public PlayerCharacter Character { get; set; }

        [Column(TypeName = "jsonb")]
        public Dictionary<int, PlayerCharacterRaiderIoSeasonScores> Seasons { get; set; }
    }

    public class PlayerCharacterRaiderIoSeasonScores
    {
        public decimal All { get; set; }
        public decimal Dps { get; set; }
        public decimal Healer { get; set; }
        public decimal Tank { get; set; }
        public decimal Spec1 { get; set; }
        public decimal Spec2 { get; set; }
        public decimal Spec3 { get; set; }
        public decimal Spec4 { get; set; }
    }
}
