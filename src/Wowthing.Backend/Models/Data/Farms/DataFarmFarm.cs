using System.Collections.Generic;

namespace Wowthing.Backend.Models.Data.Farms
{
    public class DataFarmFarm
    {
        public int QuestId { get; set; }
        public string Location { get; set; }
        public string Name { get; set; }
        public string Reset { get; set; }
        
        public List<DataFarmDrop> Drops { get; set; }
    }
}
