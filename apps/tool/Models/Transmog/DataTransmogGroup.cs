namespace Wowthing.Tool.Models.Transmog;

public class DataTransmogGroup
{
    public string Name { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string? Tag { get; set; }
    public Dictionary<string, List<DataTransmogSet>>? Data { get; set; }
    public List<string>? Sets { get; set; }
}
