using Wowthing.Backend.Models.Data.Vendors;
using Wowthing.Lib.Enums;

namespace Wowthing.Backend.Models.Manual;

public class ManualVendorItem
{
    public int ClassMask { get; set; }
    public int Id { get; set; }
    public string Note { get; set; }
    public string Reputation { get; set; }
    public int SubType { get; set; }
    public WowQuality Quality { get; set; }
    public RewardType Type { get; set; }
    public Dictionary<int, int> Costs { get; set; }

    [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
    public int? AppearanceId { get; set; }

    public ManualVendorItem()
    {}

    public ManualVendorItem(DataVendorItem item)
    {
        Id = item.Id;
        Note = item.Note;
        Reputation = item.Reputation;
        Type = Enum.Parse<RewardType>(item.Type, true);
        Costs = item.Costs;

        if (item.AppearanceId > 0)
        {
            AppearanceId = item.AppearanceId;
        }
    }
}
