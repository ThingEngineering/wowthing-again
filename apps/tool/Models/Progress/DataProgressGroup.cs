namespace Wowthing.Tool.Models.Progress;

public class DataProgressGroup
{
    public int MinimumLevel { get; set; }
    public string Icon { get; set; } = string.Empty;
    public string? IconText { get; set; }
    public string? Lookup { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? RequiredQuestId { get; set; }
    public string Type { get; set; } = string.Empty;
    public Dictionary<string, List<DataProgressData>> Data { get; set; } = new();
    public List<int>? Currencies { get; set; }
}
