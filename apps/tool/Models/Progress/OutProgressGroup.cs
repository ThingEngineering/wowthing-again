namespace Wowthing.Tool.Models.Progress;

public class OutProgressGroup
{
    [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
    public int? MinimumLevel { get; set; }

    public string Icon { get; set; }
    public string Lookup { get; set; }
    public string Name { get; set; }
    public string Type { get; set; }
    public Dictionary<string, List<OutProgressData>> Data { get; set; }

    [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
    public string IconText { get; set; }

    [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
    public List<int> RequiredQuestIds { get; set; }

    public OutProgressGroup(DataProgressGroup data)
    {
        if (data.MinimumLevel > 0)
        {
            MinimumLevel = data.MinimumLevel;
        }

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

        if (!string.IsNullOrWhiteSpace(data.RequiredQuestId))
        {
            RequiredQuestIds = data.RequiredQuestId
                .Split(' ')
                .Select(int.Parse)
                .ToList();
        }
    }
}
