using Wowthing.Backend.Models.Data.Transmog;

namespace Wowthing.Backend.Models.Manual.Transmog;

public class ManualTransmogSet
{
    public int WowheadSetId { get; set; }
    public string Name { get; set; }
    public Dictionary<string, List<int>> Items { get; set; }

    public ManualTransmogSet(DataTransmogSet set)
    {
        WowheadSetId = set.WowheadSetId;
        Name = set.Name;
        Items = set.Items
            .EmptyIfNull()
            .ToDictionary(
                kvp => kvp.Key,
                kvp => kvp.Value
                    .Trim()
                    .Split()
                    .Select(int.Parse)
                    .ToList()
            );
    }
}
