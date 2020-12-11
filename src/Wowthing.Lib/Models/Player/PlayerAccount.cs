using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;
using Wowthing.Lib.Enums;

namespace Wowthing.Lib.Models
{
    public class PlayerAccount
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("User")]
        public long UserId { get; set; }
        public ApplicationUser User { get; set; }

        public WowRegion Region { get; set; }
        public long AccountId { get; set; }

        public string Name { get; set; }
        public string Tag { get; set; }
        public bool Enabled { get; set; } = true;

        // Navigation properties
        public List<PlayerCharacter> Characters { get; set; }
    }
}
