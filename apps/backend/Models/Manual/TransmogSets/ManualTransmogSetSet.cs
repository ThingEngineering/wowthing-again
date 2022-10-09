using Wowthing.Backend.Models.Data.TransmogSets;
using Wowthing.Lib.Enums;

namespace Wowthing.Backend.Models.Manual.TransmogSets;

public class ManualTransmogSetSet
{
    public bool? Completionist { get; set; }
    public string Name { get; set; }
    public List<int> MatchTags { get; set; }

    public ManualTransmogSetSet(DataTransmogSetSet set, Dictionary<string, int> tagMap)
    {
        Completionist = set.Completionist;
        Name = set.Name;

        MatchTags = set.MatchTags
            .EmptyIfNull()
            .Select(tag => tagMap[tag])
            .ToList();
    }
}
