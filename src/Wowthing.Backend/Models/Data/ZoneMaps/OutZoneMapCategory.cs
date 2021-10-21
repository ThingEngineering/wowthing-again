using System.Collections.Generic;
using System.Linq;
using Wowthing.Lib.Extensions;

namespace Wowthing.Backend.Models.Data.ZoneMaps
{
    public class OutZoneMapCategory
    {
        public int MinimumLevel { get; set; }
        public int RequiredQuestId { get; set; }
        public string MapName { get; set; }
        public string Name { get; set; }
        public string WowheadGuide { get; set; }
        public List<OutZoneMapFarm> Farms { get; set; }

        public string Slug => Name.Slugify();
        
        public OutZoneMapCategory(DataZoneMapCategory cat)
        {
            MinimumLevel = cat.MinimumLevel;
            RequiredQuestId = cat.RequiredQuestId;
            MapName = cat.MapName;
            Name = cat.Name;
            WowheadGuide = cat.WowheadGuide;
            Farms = cat.Farms
                .EmptyIfNull()
                .Select(farm => new OutZoneMapFarm(farm))
                .ToList();
        }
    }
}
