using Wowthing.Backend.Converters.Manual;
using Wowthing.Backend.Models.Data.Vendors;

namespace Wowthing.Backend.Models.Manual.Vendors;

[JsonConverter(typeof(ManualSharedVendorConverter))]
public class ManualSharedVendor
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Note { get; set; }
    public string[] Tags { get; set; }
    public Dictionary<string, string[]> Locations { get; set; }
    public ManualSharedVendorSet[] Sets { get; set; }
    public ManualVendorItem[] Sells { get; set; }

    public ManualSharedVendor(DataSharedVendor vendor)
    {
        Id = vendor.Id;
        Name = vendor.Name;
        Note = vendor.Note;
        Tags = vendor.Tags;
        Locations = vendor.Locations;

        Sets = vendor.Sets
            .EmptyIfNull()
            .Select(set => new ManualSharedVendorSet(set))
            .ToArray();

        Sells = vendor.Sells
            .EmptyIfNull()
            .Select(item => new ManualVendorItem(item))
            .ToArray();
    }
}
