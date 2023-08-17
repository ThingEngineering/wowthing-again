namespace Wowthing.Tool.Models.Vendors;

public class DataVendorItem
{
    public string AppearanceId { get; set; }
    public int Id { get; set; }
    public string? BonusIds { get; set; }
    public string? Note { get; set; }
    public string? Quality { get; set; }
    public string? Reputation { get; set; }
    public string Type { get; set; } = string.Empty;
    public Dictionary<int, int>? Costs { get; set; }
}
