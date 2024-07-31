namespace Wowthing.Tool.Models.Progress;

public class DataProgressData
{
    public string Id { get; set; } = string.Empty;
    public string? Description { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Type { get; set; }
    public int Value { get; set; }
    public bool Required { get; set; }
}
