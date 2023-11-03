namespace Wowthing.Tool.Models.Db;

public class RedisDbData
{
    public Dictionary<int, string> MapsById { get; set; }
    public Dictionary<int, string> RequirementsById { get; set; }
    public Dictionary<int, string> TagsById { get; set; }
    public OutDbThing[] RawThings { get; set; }
}
