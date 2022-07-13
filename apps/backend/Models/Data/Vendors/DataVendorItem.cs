namespace Wowthing.Backend.Models.Data.Vendors
{
    public class DataVendorItem
    {
        public int AppearanceId { get; set; }
        public int Id { get; set; }
        public Dictionary<int, int> Costs { get; set; }
    }
}
