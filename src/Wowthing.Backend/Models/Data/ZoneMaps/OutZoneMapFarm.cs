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

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
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
            Location = (farm.Location ?? "").Split();
            Name = farm.Name;
            NpcId = farm.NpcId;
            QuestIds = farm.QuestId.Split().Select(q => int.Parse(q)).ToList();

            if (!string.IsNullOrEmpty(farm.Faction))
            {
                Faction = farm.Faction;
            }

            if (!string.IsNullOrEmpty(farm.Note))
            {
                Note = farm.Note;
            }

            Reset = farm.Reset ?? "daily";
            Type = farm.Type ?? "kill";
        }
    }
}
