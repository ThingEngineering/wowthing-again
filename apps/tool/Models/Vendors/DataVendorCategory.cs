namespace Wowthing.Tool.Models.Vendors;

public class DataVendorCategory : ICloneable, IDataCategoryNested<DataVendorCategory>
{
    public string Name { get; set; } = string.Empty;
    public List<string>? VendorMaps { get; set; }
    public List<string>? VendorSets { get; set; }
    public List<string>? VendorTags { get; set; }
    public List<DataVendorGroup>? Groups { get; set; }
    public List<DataVendorCategory?> Children { get; } = new();

    public object Clone()
    {
        return new DataVendorCategory
        {
            Name = (string)Name.Clone(),
            // We don't have to change these, reference is fine
            Groups = Groups,
            VendorMaps = VendorMaps,
            VendorSets = VendorSets,
            VendorTags = VendorTags,
        };
    }
}
