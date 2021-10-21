namespace Wowthing.Backend.Models.Data.ZoneMaps
{
    public class OutZoneMapDrop
    {
        public int Id { get; set; }
        public string[] Limit { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }

        public OutZoneMapDrop(DataZoneMapDrop drop)
        {
            Id = drop.Id;
            Name = drop.Name;
            Type = drop.Type;

            if (!string.IsNullOrWhiteSpace(drop.Limit))
            {
                Limit = drop.Limit.Split();
            }
        }
    }
}
