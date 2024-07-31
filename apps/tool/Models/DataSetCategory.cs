namespace Wowthing.Tool.Models;

public class DataSetCategory
{
    public string Name { get; set; } = string.Empty;
    public List<DataSetGroup>? Groups { get; set; }
}
