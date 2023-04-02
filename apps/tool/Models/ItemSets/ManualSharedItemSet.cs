using Wowthing.Tool.Converters.Manual;

namespace Wowthing.Tool.Models.ItemSets;

[JsonConverter(typeof(ManualSharedItemSetConverter))]
public class ManualSharedItemSet
{
    public int[][] Items { get; set; }
    public string Name { get; set; }
    public List<int> Tags { get; set; }

    public ManualSharedItemSet(DataSharedItemSet itemSet, List<int> tags)
    {
        Name = itemSet.Name;
        Tags = tags;

        Items = itemSet.Items
            .EmptyIfNull()
            .Select(item => item
                .Split(' ')
                .Select(int.Parse)
                .ToArray()
            )
            .ToArray();
    }
}
