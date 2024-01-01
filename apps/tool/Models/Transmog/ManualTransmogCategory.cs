using Wowthing.Tool.Converters.Manual;

namespace Wowthing.Tool.Models.Transmog;

[JsonConverter(typeof(ManualTransmogCategoryConverter))]
public class ManualTransmogCategory
{
    public string Name { get; set; }
    public List<string> SkipClasses { get; set; }
    public List<ManualTransmogGroup> Groups { get; set; }

    public string Slug => Name.Slugify();

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
