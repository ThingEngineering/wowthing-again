namespace Wowthing.Tool.Models.Progress;

public class OutProgressGroup
{
    public int? MinimumLevel { get; set; }

    public string Icon { get; set; }
    public string? Lookup { get; set; }
    public string Name { get; set; }
    public string Type { get; set; }
    public Dictionary<string, List<OutProgressData>> Data { get; set; }
    public List<int>? Currencies { get; set; }

    public string? IconText { get; set; }

    public List<int> RequiredQuestIds { get; set; } = new();

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
        Currencies = data.Currencies;

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
