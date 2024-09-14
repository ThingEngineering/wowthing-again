namespace Wowthing.Backend.Models.Uploads;

public class UploadWarbank
{
    public long Copper { get; set; }
    public Dictionary<string, Dictionary<string, string>> Items { get; set; }
    public int ScannedAt { get; set; }
}
