using Wowthing.Backend.Converters;

namespace Wowthing.Backend.Models.Data.Collections;

[JsonConverter(typeof(OutCollectionCategoryConverter))]
public class OutCollectionCategory
{
    public string Name { get; set; }
    public List<OutCollectionGroup> Groups { get; set; }

    public string Slug => Name.Slugify();

    public OutCollectionCategory(DataCollectionCategory category)
    {
        Name = category.Name;
        Groups = category.Groups
            .EmptyIfNull()
            .Select(group => new OutCollectionGroup(group))
            .ToList();
    }
}
