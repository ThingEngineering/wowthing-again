namespace Wowthing.Tool.Models.Transmog;

public class ManualTransmogGroup
{
    public string Name { get; }
    public string Type { get; }
    public string? Tag { get; }

    public Dictionary<string, List<ManualTransmogSet>> Data { get; }

    public List<string> Sets { get; }

    public ManualTransmogGroup(DataTransmogGroup group)
    {
        Name = group.Name;
        Tag = group.Tag;
        Type = group.Type;

        Data = group.Data
            .EmptyIfNull()
            .ToDictionary(
                kvp => kvp.Key,
                kvp => kvp.Value
                    .Select(set => new ManualTransmogSet(set))
                    .ToList()
            );

        Sets = group.Sets.EmptyIfNull();
    }
}
