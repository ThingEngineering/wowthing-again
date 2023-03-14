namespace Wowthing.Tool.Models.Collections;

public class DataCollectionGroup
{
    public string Name { get; set; }
    public List<string> Things { get; set; } = new();
}
