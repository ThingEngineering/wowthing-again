using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Wowthing.Lib.Models
{
    public class PlayerCharacterLockouts
    {
        [Key, ForeignKey("Character")]
        public int CharacterId { get; set; }
        public PlayerCharacter Character { get; set; }

        public DateTime LastUpdated { get; set; } = DateTime.MinValue;

        [Column(TypeName = "jsonb")]
        public List<PlayerCharacterLockoutsLockout> Lockouts { get; set; }
    }

    public class PlayerCharacterLockoutsLockout
    {
        public bool Locked { get; set; }
        public int DefeatedBosses { get; set; }
        public int Difficulty { get; set; }
        public int Id { get; set; }
        public int MaxBosses { get; set; }
        public string Name { get; set; }
        public DateTime ResetTime { get; set; }
        public List<PlayerCharacterLockoutsLockoutBoss> Bosses { get; set; }
    }

    public class PlayerCharacterLockoutsLockoutBoss
    {
        public bool Dead { get; set; }
        public string Name { get; set; }
    }
}
