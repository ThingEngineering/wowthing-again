namespace Wowthing.Tool.Models.Appearances;

public class RedisAppearances
{
    public Dictionary<string, List<RedisAppearanceData>> RawAppearances { get; set; } = new();
}
