using Wowthing.Tool.Converters.Manual;

namespace Wowthing.Tool.Models.Vendors;

[JsonConverter(typeof(ManualVendorCategoryConverter))]
public class ManualVendorCategory
{
    public string Name { get; set; }
    public List<string> VendorMaps { get; set; }
    public List<string> VendorTags { get; set; }
    public List<ManualVendorGroup> Groups { get; set; }

    public string Slug => Name.Slugify();

    public ManualVendorCategory(DataVendorCategory category)
    {
        Name = category.Name;
        Groups = category.Groups
            .EmptyIfNull()
            .Select(group => new ManualVendorGroup(group))
            .ToList();
        VendorMaps = category.VendorMaps
            .EmptyIfNull();
        VendorTags = category.VendorTags
            .EmptyIfNull();
    }
}
