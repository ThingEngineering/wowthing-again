namespace Wowthing.Tool.Models.Db;

public class DataDbFile
{
    public string? Location { get; set; }

    public List<string>? Requirements { get; set; }
    public List<string>? Tags { get; set; }
    public List<DataDbThing>? Things { get; set; }
}
