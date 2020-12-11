using System;
using System.Collections.Generic;
using System.Text;
using Wowthing.Lib.Enums;

namespace Wowthing.Lib.Models
{
    public class Team
    {
        public Guid Id { get; set; }
        
        public WowRegion Region { get; set; }
        public int DefaultRealmId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }

        // Navigation properties
        public List<TeamCharacter> Characters { get; set; }
    }
}
