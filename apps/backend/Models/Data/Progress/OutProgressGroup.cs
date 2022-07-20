namespace Wowthing.Backend.Models.Data.Progress;

public class OutProgressGroup
{
    public string Icon { get; set; }
    public string Lookup { get; set; }
    public string Name { get; set; }
    public string Type { get; set; }
    public Dictionary<string, List<OutProgressData>> Data { get; set; }

    [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
    public string IconText { get; set; }

    public OutProgressGroup(DataProgressGroup data)
    {
        Icon = data.Icon;
        IconText = data.IconText;
        Lookup = data.Lookup;
        Name = data.Name;
        Type = data.Type;
        Data = data.Data
            .EmptyIfNull()
            .ToDictionary(
                kvp => kvp.Key,
                kvp => kvp.Value
                    .EmptyIfNull()
                    .Select(v => new OutProgressData(v))
                    .ToList()
            );
    }
}