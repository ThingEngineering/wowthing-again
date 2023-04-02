namespace Wowthing.Tool.Models.Vendors;

public class ManualSharedVendorSet
{
    public string Name { get; set; }
    public int[] Range { get; set; }
    public bool SkipTooltip { get; set; }
    public string SortKey { get; set; }

    public ManualSharedVendorSet(DataSharedVendorSet set)
    {
        Name = set.Name;
        SkipTooltip = set.SkipTooltip;
        SortKey = set.SortKey;

        var parts = set.Range
            .Split(' ');

        if (parts.Length == 1)
        {
            Range = new[] { int.Parse(parts[0]), 0 };
        }
        else
        {
            Range = new[] { int.Parse(parts[0]), int.Parse(parts[1]) };
        }
    }
}
