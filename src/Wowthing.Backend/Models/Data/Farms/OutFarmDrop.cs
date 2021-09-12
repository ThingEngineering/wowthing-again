namespace Wowthing.Backend.Models.Data.Farms
{
    public class OutFarmDrop
    {
        public int Id { get; set; }
        public string[] Limit { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }

        public OutFarmDrop(DataFarmDrop drop)
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
