namespace Wowthing.Backend.Models.Uploads;

public class UploadGuild
{
    public long Copper { get; set; }
    public Dictionary<string, Dictionary<string, string>> Items { get; set; }
    public Dictionary<string, string[]> Tabs { get; set; }
}