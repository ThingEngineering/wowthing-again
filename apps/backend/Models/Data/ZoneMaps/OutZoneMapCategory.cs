namespace Wowthing.Backend.Models.Data.ZoneMaps
{
    public class OutZoneMapCategory
    {
        public int MinimumLevel { get; set; }
        public string MapName { get; set; }
        public string Name { get; set; }
        public string WowheadGuide { get; set; }

        public List<int> RequiredQuestIds { get; set; }

        [JsonProperty("farmsRaw")]
        public List<OutZoneMapFarm> Farms { get; set; }

        public string Slug => Name.Slugify();
        
        public OutZoneMapCategory(DataZoneMapCategory cat)
        {
            MinimumLevel = cat.MinimumLevel;
            MapName = cat.MapName;
            Name = cat.Name;
            WowheadGuide = cat.WowheadGuide;

            RequiredQuestIds = (string.IsNullOrWhiteSpace(cat.RequiredQuestId) ? "" : cat.RequiredQuestId)
                .Split(' ', StringSplitOptions.RemoveEmptyEntries)
                .Select(q => int.Parse(q))
                .ToList();

            Farms = cat.Farms
                .EmptyIfNull()
                .Select(farm => new OutZoneMapFarm(farm))
                .ToList();
        }
    }
}
