namespace Wowthing.Backend.Models.Data.ZoneMaps
{
    public class DataZoneMapFarm
    {
        public int MinimumLevel { get; set; }
        public int NpcId { get; set; }
        public int ObjectId { get; set; }
        public int StatisticId { get; set; }
        public string Faction { get; set; }
        public string Location { get; set; }
        public string Name { get; set; }
        public string Note { get; set; }
        public string QuestId { get; set; }
        public string RequiredQuestId { get; set; }
        public string Reset { get; set; }
        public string Type { get; set; }
        
        public List<DataZoneMapDrop> Drops { get; set; }
    }
}
