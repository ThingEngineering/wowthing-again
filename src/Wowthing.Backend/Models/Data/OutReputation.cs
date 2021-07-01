using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Wowthing.Backend.Models.Data
{
    public class OutReputation
    {
        public int Id { get; set; }
        public int TierId { get; set; }
        public string Name { get; set; }

        public OutReputation(DumpFaction faction)
        {
            Id = faction.ID;
            TierId = faction.FriendshipRepID;
            Name = faction.Name;
        }
    }
}
