using Wowthing.Backend.Models.Data.Vendors;
using Wowthing.Lib.Enums;

namespace Wowthing.Backend.Models.Manual.Vendors;

public class ManualVendorGroup
{
    public string Name { get; set; }
    public List<ManualVendorItem> Things { get; set; }

    public ManualVendorGroup(DataVendorGroup group)
    {
        Name = group.Name;
        Things = group.Things
            .EmptyIfNull()
            .Select(item => new ManualVendorItem(item))
            .ToList();
    }
}