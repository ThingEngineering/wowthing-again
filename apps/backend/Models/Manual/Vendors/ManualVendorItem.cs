using Wowthing.Backend.Models.Data.Vendors;
using Wowthing.Lib.Enums;

namespace Wowthing.Backend.Models.Manual.Vendors;

public class ManualVendorItem
{
    public int Id { get; set; }
    public int ClassMask { get; set; }
    public WowQuality Quality { get; set; }
    public Dictionary<int, int> Costs { get; set; }

    [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
    public int? AppearanceId { get; set; }

    public ManualVendorItem(DataVendorItem item)
    {
        Id = item.Id;
        Costs = item.Costs;

        if (item.AppearanceId > 0)
        {
            AppearanceId = item.AppearanceId;
        }
    }
}
