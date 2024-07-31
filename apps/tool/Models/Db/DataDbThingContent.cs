namespace Wowthing.Tool.Models.Db;

public class DataDbThingContent
{
    public int Id { get; set; }
    public string? Note { get; set; }
    public string Type { get; set; } = string.Empty;

    public Dictionary<int, int>? Costs { get; set; }
    public string[]? Requirements { get; set; }
}
