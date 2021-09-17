using System.Collections.Generic;
using System.Linq;
using Wowthing.Lib.Extensions;

namespace Wowthing.Backend.Models.Data.Farms
{
    public class OutFarmCategory
    {
        public int MinimumLevel { get; set; }
        public string MapName { get; set; }
        public string Name { get; set; }
        public string WowheadGuide { get; set; }
        public List<OutFarmFarm> Farms { get; set; }

        public string Slug => Name.Slugify();
        
        public OutFarmCategory(DataFarmCategory cat)
        {
            MinimumLevel = cat.MinimumLevel;
            MapName = cat.MapName;
            Name = cat.Name;
            WowheadGuide = cat.WowheadGuide;
            Farms = cat.Farms
                .EmptyIfNull()
                .Select(farm => new OutFarmFarm(farm))
                .ToList();
        }
    }
}
