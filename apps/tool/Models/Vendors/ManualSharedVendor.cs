
using Wowthing.Tool.Converters.Manual;

namespace Wowthing.Tool.Models.Vendors;

[JsonConverter(typeof(ManualSharedVendorConverter))]
public class ManualSharedVendor
{
    public int Id { get; set; }
    public int? ZoneMapsGroupId { get; set; }
    public string Name { get; set; }
    public string? Note { get; set; }
    public string[]? Tags { get; set; }
    public Dictionary<string, string[]>? Locations { get; set; }
    public ManualSharedVendorSet[] Sets { get; set; }
    public ManualVendorItem[] Sells { get; set; }

    public ManualSharedVendor(DataSharedVendor vendor)
    {
        Id = vendor.Id;
        Name = vendor.Name;
        Note = vendor.Note;
        Tags = vendor.Tags;
        Locations = vendor.Locations;

        if (vendor.ZoneMapsGroupId > 0)
        {
            ZoneMapsGroupId = vendor.ZoneMapsGroupId;
        }

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
