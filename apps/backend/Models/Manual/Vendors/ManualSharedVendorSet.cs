using Wowthing.Backend.Models.Data.Vendors;

namespace Wowthing.Backend.Models.Manual.Vendors;

public class ManualSharedVendorSet
{
    public string Name { get; set; }
    public int[] Range { get; set; }
    public string SortKey { get; set; }

    public ManualSharedVendorSet(DataSharedVendorSet set)
    {
        Name = set.Name;
        Range = set.Range
            .Split(' ')
            .Select(int.Parse)
            .ToArray();
        SortKey = set.SortKey;
    }
}
