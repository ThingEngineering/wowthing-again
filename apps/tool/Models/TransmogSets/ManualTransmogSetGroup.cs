namespace Wowthing.Tool.Models.TransmogSets;

public class ManualTransmogSetGroup
{
    public bool? Completionist { get; set; }
    public string Name { get; set; }
    public string Prefix { get; set; }
    public TransmogSetMatchType MatchType { get; set; }
    public TransmogSetType Type { get; set; }
    public Dictionary<int, List<int>> BonusIds { get; set; }
    public List<int> MatchTags { get; set; }
    public List<ManualTransmogSetSet> Sets { get; set; }

    public ManualTransmogSetGroup(DataTransmogSetGroup group, Dictionary<string, int> tagMap)
    {
        Completionist = group.Completionist;
        Name = group.Name;
        Prefix = group.Prefix;

        MatchType = Enum.Parse<TransmogSetMatchType>(group.MatchType ?? "any", true);
        Type = Enum.Parse<TransmogSetType>(group.Type ?? "class", true);

        MatchTags = group.MatchTags
            .EmptyIfNull()
            .Select(tag => tagMap[tag])
            .ToList();

        Sets = group.Sets
            .EmptyIfNull()
            .Select(set => new ManualTransmogSetSet(set, tagMap))
            .ToList();

        BonusIds = group.BonusIds
            .EmptyIfNull()
            .ToDictionary(
                kvp => int.Parse(kvp.Key),
                kvp => kvp.Value
                    .Split(' ')
                    .Select(int.Parse)
                    .ToList()
            );
    }
}
