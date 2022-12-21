using Wowthing.Backend.Models.Data.TransmogSets;
using Wowthing.Lib.Enums;

namespace Wowthing.Backend.Models.Manual.TransmogSets;

public class ManualTransmogSetGroup
{
    public bool? Completionist { get; set; }
    public string Name { get; set; }
    public string Prefix { get; set; }
    public TransmogSetType Type { get; set; }
    public Dictionary<int, List<int>> BonusIds { get; set; }
    public List<int> MatchTags { get; set; }

    public ManualTransmogSetGroup(DataTransmogSetGroup group, Dictionary<string, int> tagMap)
    {
        Completionist = group.Completionist;
        Name = group.Name;
        Prefix = group.Prefix;

        Type = Enum.Parse<TransmogSetType>(group.Type ?? "class", true);

        MatchTags = group.MatchTags
            .EmptyIfNull()
            .Select(tag => tagMap[tag])
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
