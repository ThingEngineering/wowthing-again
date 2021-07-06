﻿namespace Wowthing.Backend.Models.Data
{
    public class OutReputation
    {
        public int Id { get; set; }
        public int TierId { get; set; }
        public string Name { get; set; }

        public OutReputation(DumpFaction faction)
        {
            Id = faction.Id;
            TierId = faction.FriendshipRepId;
            Name = faction.Name;
        }
    }
}
