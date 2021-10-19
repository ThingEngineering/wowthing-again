using System.Collections.Generic;

namespace Wowthing.Backend.Models.Data.Farms
{
    public class DataFarmFarm
    {
        public int NpcId { get; set; }
        public string Faction { get; set; }
        public string Location { get; set; }
        public string Name { get; set; }
        public string Note { get; set; }
        public string QuestId { get; set; }
        public string Reset { get; set; }
        public string Type { get; set; }
        
        public List<DataFarmDrop> Drops { get; set; }
    }
}
