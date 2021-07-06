using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Wowthing.Lib.Enums;

namespace Wowthing.Lib.Models.Team
{
    public class Team
    {
        [Key]
        public int Id { get; set; }

        public Guid Guid { get; set; }

        [ForeignKey("User")]
        public long UserId { get; set; }
        public ApplicationUser User { get; set; }

        public WowRegion Region { get; set; }
        public int DefaultRealmId { get; set; }
        public string Name { get; set; }
        public string Slug { get; set; }
        public string Description { get; set; }

        // Navigation properties
        public List<TeamCharacter> Characters { get; set; }
    }
}
