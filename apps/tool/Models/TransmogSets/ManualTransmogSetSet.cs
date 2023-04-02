namespace Wowthing.Tool.Models.TransmogSets;

public class ManualTransmogSetSet
{
    public bool? Completionist { get; set; }
    public int? Modifier { get; set; }
    public string Name { get; set; }
    public List<int> MatchTags { get; set; }

    public ManualTransmogSetSet(DataTransmogSetSet set, Dictionary<string, int> tagMap)
    {
        Completionist = set.Completionist;
        Modifier = set.Modifier;
        Name = set.Name;

        MatchTags = set.MatchTags
            .EmptyIfNull()
            .Select(tag => tagMap[tag])
            .ToList();
    }
}
