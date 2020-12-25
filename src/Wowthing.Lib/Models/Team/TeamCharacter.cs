using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;
using Wowthing.Lib.Enums;

namespace Wowthing.Lib.Models
{
    public class TeamCharacter
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("Team")]
        public int TeamId { get; set; }
        public Team Team { get; set; }

        [ForeignKey("Character")]
        public int CharacterId { get; set; }
        public PlayerCharacter Character { get; set; }

        public WowRole PrimaryRole { get; set; }
        public WowRole SecondaryRole { get; set; }
        public string Note { get; set; }
    }
}
