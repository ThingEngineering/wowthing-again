namespace Wowthing.Tool.Models.Vendors;

public class DataSharedVendorSet
{
    public string Name { get; set; } = string.Empty;
    public string? Range { get; set; }
    public bool ShowNormalTag { get; set; }
    public bool SkipTooltip { get; set; }
    public string? SortKey { get; set; }
}
