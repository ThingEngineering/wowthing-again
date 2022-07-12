using Wowthing.Backend.Converters.Manual;

namespace Wowthing.Backend.Models.Manual;

[JsonConverter(typeof(ManualVendorConverter))]
public class ManualVendor
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Note { get; set; }
    public string[] Tags { get; set; }
    public Dictionary<string, string[]> Locations { get; set; }
    public ManualVendorItem[] Sells { get; set; }
}

public class ManualVendorItem
{
    public int Id { get; set; }
    public string Note { get; set; }
    public string Type { get; set; }
}
