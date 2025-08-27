namespace Wowthing.Tool.Models.Instances;

public class DataInstanceEncounter
{
    public string? AddBefore { get; set; }
    public string? AddAfter { get; set; }
    public string? Difficulties { get; set; }
    public string? Name { get; set; }
    public List<DataInstanceContent> Contents { get; set; }
}
