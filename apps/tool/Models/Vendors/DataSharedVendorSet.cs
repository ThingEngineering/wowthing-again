namespace Wowthing.Tool.Models.Vendors;

public class DataSharedVendorSet
{
    public List<int>? BonusIds { get; set; }
    public string Name { get; set; } = string.Empty;
    public int OverrideDifficulty { get; set; }
    public string? Range { get; set; }
    public bool ShowNormalTag { get; set; }
    public bool SkipTooltip { get; set; }
    public string? SortKey { get; set; }
}
