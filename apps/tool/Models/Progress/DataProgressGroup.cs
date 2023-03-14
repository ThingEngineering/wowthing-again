namespace Wowthing.Tool.Models.Progress;

public class DataProgressGroup
{
    public int MinimumLevel { get; set; }
    public string Icon { get; set; }
    public string IconText { get; set; }
    public string Lookup { get; set; }
    public string Name { get; set; }
    public string RequiredQuestId { get; set; }
    public string Type { get; set; }
    public Dictionary<string, List<DataProgressData>> Data { get; set; }
}
