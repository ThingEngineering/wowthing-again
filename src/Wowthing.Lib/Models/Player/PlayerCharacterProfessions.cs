using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Wowthing.Lib.Models
{
    public class PlayerCharacterProfessions
    {
        [Key, ForeignKey("Character")]
        public int CharacterId { get; set; }
        public PlayerCharacter Character { get; set; }

        [Column(TypeName = "jsonb")]
        public Dictionary<int, Dictionary<int, PlayerCharacterProfessionTier>> Professions { get; set; }
    }

    public class PlayerCharacterProfessionTier
    {
        public int CurrentSkill { get; set; }
        public int MaxSkill { get; set; }
        public List<int> KnownRecipes { get; set; }
    }
}
