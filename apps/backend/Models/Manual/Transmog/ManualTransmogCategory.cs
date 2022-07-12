using Wowthing.Backend.Converters.Manual;
using Wowthing.Backend.Models.Data.Transmog;

namespace Wowthing.Backend.Models.Manual.Transmog;

[JsonConverter(typeof(ManualTransmogCategoryConverter))]
public class ManualTransmogCategory
{
    public string Name { get; set; }
    public List<string> SkipClasses { get; set; }
    public List<ManualTransmogGroup> Groups { get; set; }

    public string Slug => Name.Slugify();

    public ManualTransmogCategory()
    {
    }

    public ManualTransmogCategory(DataTransmogCategory category)
    {
        Name = category.Name;
        SkipClasses = category.SkipClasses.EmptyIfNull();
        Groups = category.Groups
            .EmptyIfNull()
            .Select(group => new ManualTransmogGroup(group))
            .ToList();
    }
}
