using System;
using System.Collections.Generic;

namespace Wowthing.Backend.Models.Data.ZoneMaps
{
    public class DataZoneMapCategory : IDataCategory, ICloneable
    {
        public int MinimumLevel { get; set; }
        public int RequiredQuestId { get; set; }
        public string MapName { get; set; }
        public string Name { get; set; }
        public string WowheadGuide { get; set; }
        public List<DataZoneMapFarm> Farms { get; set; }

        public object Clone()
        {
            return new DataZoneMapCategory
            {
                MapName = MapName,
                MinimumLevel = MinimumLevel,
                Name = (string)Name.Clone(),
                WowheadGuide = WowheadGuide,
                Farms = Farms,
            };
        }
    }
}
