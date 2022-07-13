namespace Wowthing.Backend.Models.Data.Vendors
{
    public class DataVendorItem
    {
        public int AppearanceId { get; set; }
        public int Id { get; set; }
        public string Note { get; set; }
        public string Reputation { get; set; }
        public string Type { get; set; }
        public Dictionary<int, int> Costs { get; set; }
    }
}
