using Wowthing.Backend.Converters;
using Wowthing.Lib.Enums;

namespace Wowthing.Backend.Models.Data.ZoneMaps
{
    [JsonConverter(typeof(OutZoneMapFarmConverter))]
    public class OutZoneMapFarm
    {
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int? MinimumLevel { get; set; }
        
        public FarmIdType IdType { get; set; }
        public int Id { get; set; }
        
        public string[] Location { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string Faction { get; set; }

        public string Name { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string Note { get; set; }

        public FarmResetType Reset { get; set; }
        public FarmType Type { get; set; }
        public List<int> QuestIds { get; set; }
        
        public List<int> RequiredQuestIds { get; set; }

        [JsonProperty(PropertyName = "dropsRaw")]
        public List<OutZoneMapDrop> Drops { get; set; }

        public OutZoneMapFarm(DataZoneMapFarm farm)
        {
            Drops = farm.Drops
                .EmptyIfNull()
                .Select(drop => new OutZoneMapDrop(drop))
                .ToList();
            Location = (farm.Location ?? "").Split();
            Name = farm.Name;
            
            QuestIds = farm.QuestId
                .EmptyIfNullOrWhitespace()
                .Split(' ', StringSplitOptions.RemoveEmptyEntries)
                .Select(q => int.Parse(q))
                .ToList();
            
            RequiredQuestIds = farm.RequiredQuestId
                .EmptyIfNullOrWhitespace()
                .Split(' ', StringSplitOptions.RemoveEmptyEntries)
                .Select(q => int.Parse(q))
                .ToList();

            if (farm.MinimumLevel > 0)
            {
                MinimumLevel = farm.MinimumLevel;
            }
            
            if (farm.ObjectId > 0)
            {
                IdType = FarmIdType.Object;
                Id = farm.ObjectId;
            }
            else
            {
                IdType = FarmIdType.Npc;
                Id = farm.NpcId;
            }

            if (!string.IsNullOrEmpty(farm.Faction))
            {
                Faction = farm.Faction;
            }

            if (!string.IsNullOrEmpty(farm.Note))
            {
                Note = farm.Note;
            }

            Reset = Enum.Parse<FarmResetType>(farm.Reset ?? "daily", true);
            Type = Enum.Parse<FarmType>(farm.Type ?? "kill", true);
        }
    }
}
