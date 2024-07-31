namespace Wowthing.Tool.Models.Vendors;

public class DataVendorGroup
{
    public string Name { get; set; } = string.Empty;
    public string? Type { get; set; }
    public List<DataVendorItem>? Things { get; set; }
}
