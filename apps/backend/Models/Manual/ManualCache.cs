using Wowthing.Backend.Models.Data.Collections;
using Wowthing.Backend.Models.Data.Progress;
using Wowthing.Backend.Models.Manual.Transmog;
using Wowthing.Backend.Models.Manual.Vendors;
using Wowthing.Backend.Models.Manual.ZoneMaps;
using Wowthing.Backend.Models.Static;

namespace Wowthing.Backend.Models.Manual;

public class ManualCache
{
    [JsonProperty("rawMountSets")]
    public List<List<OutCollectionCategory>> MountSets { get; set; }

    [JsonProperty("rawPetSets")]
    public List<List<OutCollectionCategory>> PetSets { get; set; }

    //[JsonProperty("rawProgressSets")]
    public List<List<OutProgress>> ProgressSets { get; set; }

    [JsonProperty("rawToySets")]
    public List<List<OutCollectionCategory>> ToySets { get; set; }

    [JsonProperty("rawTransmogSets")]
    public List<List<ManualTransmogCategory>> TransmogSets { get; set; }

    [JsonProperty("rawVendorSets")]
    public List<List<ManualVendorCategory>> VendorSets { get; set; }

    [JsonProperty("rawZoneMapSets")]
    public List<List<ManualZoneMapCategory>> ZoneMapSets { get; set; }

    // Shared
    [JsonProperty("rawSharedItems")]
    public StaticItem[] SharedItems { get; set; }

    [JsonProperty("rawSharedVendors")]
    public List<ManualSharedVendor> SharedVendors { get; set; }
}
