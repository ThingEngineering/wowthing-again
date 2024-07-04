namespace Wowthing.Tool.Models.Vendors;

public class ManualSharedVendorSet
{
    public string Name { get; set; }
    public int[] Range { get; set; }
    public bool ShowNormalTag { get; set; }
    public bool SkipTooltip { get; set; }
    public string? SortKey { get; set; }

    public ManualSharedVendorSet(DataSharedVendorSet set)
    {
        Name = set.Name;
        ShowNormalTag = set.ShowNormalTag;
        SkipTooltip = set.SkipTooltip;
        SortKey = set.SortKey;

        string[] parts = set.Range
            .EmptyIfNullOrWhitespace()
            .Split(' ');

        Range = [int.Parse(parts[0]), parts.Length == 1 ? 0 : int.Parse(parts[1])];
    }
}
