using Wowthing.Tool.Models.Vendors;

namespace Wowthing.Tool.Models.Db;

public class DataDbThing
{
    public int Id { get; set; }
    public int TrackingQuestId { get; set; }
    public string Name { get; set; }
    public string Note { get; set; }
    public string Reset { get; set; }
    public string Type { get; set; }

    public DataDbThingContent[] Contents { get; set; }
    public DataSharedVendorSet[]? Groups { get; set; }
    public Dictionary<string, string[]>? Locations { get; set; }
    public string[]? Requirements { get; set; }
    public string[]? Tags { get; set; }
}
