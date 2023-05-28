namespace Wowthing.Tool.Models.Db;

public class DataDbThing
{
    public int Id { get; set; }
    public int TrackingQuestId { get; set; }
    public string Name { get; set; }
    public string Reset { get; set; }
    public string Type { get; set; }

    public List<DataDbThingContent> Contents { get; set; }
    public Dictionary<string, List<string>> Locations { get; set; }
    public List<string> Requirements { get; set; }
    public List<string> Tags { get; set; }
}
