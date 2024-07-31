namespace Wowthing.Tool.Models.Vendors;

public class DataSharedVendor
{
    public int Id { get; set; }
    public int? ZoneMapsGroupId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Note { get; set; }
    public string[]? Tags { get; set; }
    public Dictionary<string, string[]>? Locations { get; set; }
    public DataSharedVendorSet[]? Sets { get; set; }
    public DataVendorItem[]? Sells { get; set; }
}
