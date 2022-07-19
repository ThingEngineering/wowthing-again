using Wowthing.Backend.Converters;

namespace Wowthing.Backend.Models.Data.Collections;

[JsonConverter(typeof(OutCollectionCategoryConverter))]
public class OutCollectionCategory
{
    private const int SplitThreshold = 10;
    private const int SplitSize = 8;

    public string Name { get; set; }
    public List<OutCollectionGroup> Groups { get; set; } = new();

    public string Slug => Name.Slugify();

    public OutCollectionCategory(DataCollectionCategory category)
    {
        Name = category.Name;

        foreach (var group in category.Groups.EmptyIfNull())
        {
            //if (group.Things.Count <= SplitThreshold)
            //{
            Groups.Add(new OutCollectionGroup(group));
            continue;
            //}

            var things = group.Things.ToArray();
            var count = things.Length / SplitSize;
            var leftovers = things.Length % SplitSize;

            for (int i = 0; i < count; i++)
            {
                var name = $"{group.Name} ({i + 1})";
                Groups.Add(new OutCollectionGroup(
                    name,
                    new ArraySegment<string>(
                        things,
                        i * SplitSize,
                        SplitSize
                    )
                ));
            }

            if (leftovers > 0)
            {
                var name = $"{group.Name} ({count + 1})";
                Groups.Add(new OutCollectionGroup(
                    name,
                    new ArraySegment<string>(
                        things,
                        count * SplitSize,
                        leftovers
                    )
                ));
            }
        }
    }
}