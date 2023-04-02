namespace Wowthing.Tool.Models.Vendors;

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
