using Wowthing.Backend.Converters.Manual;
using Wowthing.Backend.Models.Data.TransmogSets;

namespace Wowthing.Backend.Models.Manual.TransmogSets;

[JsonConverter(typeof(ManualTransmogSetCategoryConverter))]
public class ManualTransmogSetCategory
{
    public string Name { get; set; }
    public List<ManualTransmogSetGroup> Groups { get; set; }

    public string Slug => Name.Slugify();

    public ManualTransmogSetCategory(DataTransmogSetCategory category, Dictionary<string, int> tagMap)
    {
        Name = category.Name;

        Groups = category.Groups
            .EmptyIfNull()
            .Select(group => new ManualTransmogSetGroup(group, tagMap))
            .ToList();
    }
}
