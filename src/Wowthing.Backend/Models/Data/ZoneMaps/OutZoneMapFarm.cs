using System;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;
using Wowthing.Lib.Extensions;

namespace Wowthing.Backend.Models.Data.ZoneMaps
{
    public class OutZoneMapFarm
    {
        public int NpcId { get; set; }
        public string[] Location { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string Faction { get; set; }
        
        public string Name { get; set; }
        public string Note { get; set; }
        public string Reset { get; set; }
        public string Type { get; set; }
        public List<int> QuestIds { get; set; }
        
        public List<OutZoneMapDrop> Drops { get; set; }

        public OutZoneMapFarm(DataZoneMapFarm farm)
        {
            Drops = farm.Drops
                .EmptyIfNull()
                .Select(drop => new OutZoneMapDrop(drop))
                .ToList();
            Faction = farm.Faction;
            Location = (farm.Location ?? "").Split();
            Name = farm.Name;
            NpcId = farm.NpcId;
            Note = farm.Note;
            QuestIds = farm.QuestId.Split().Select(q => int.Parse(q)).ToList();
            
            Reset = farm.Reset ?? "daily";
            Type = farm.Type ?? "kill";
        }
    }
}
