using Wowthing.Tool.Converters.Manual;

namespace Wowthing.Tool.Models.Customizations;

[JsonConverter(typeof(ManualCustomizationCategoryConverter))]
public class ManualCustomizationCategory
{
    public string Name { get; set; }
    public List<ManualCustomizationGroup> Groups { get; } = new();

    public string Slug => Name.Slugify();

    public ManualCustomizationCategory(DataCustomizationCategory dataCategory)
    {
        Name = dataCategory.Name;
    }
}
