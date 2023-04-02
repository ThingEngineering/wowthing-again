﻿using Newtonsoft.Json.Linq;
using Wowthing.Tool.Models.Collections;
using Wowthing.Tool.Models.Dragonriding;
using Wowthing.Tool.Models.Heirlooms;
using Wowthing.Tool.Models.Illusions;
using Wowthing.Tool.Models.ItemSets;
using Wowthing.Tool.Models.Progress;
using Wowthing.Tool.Models.Transmog;
using Wowthing.Tool.Models.TransmogSets;
using Wowthing.Tool.Models.Vendors;
using Wowthing.Tool.Models.ZoneMaps;

namespace Wowthing.Tool.Models.Manual;

public class ManualCache
{
    public List<DataDragonridingCategory> Dragonriding { get; set; }
    public DataHeirloomGroup[] RawHeirloomGroups { get; set; }
    public DataIllusionGroup[] RawIllusionGroups { get; set; }
    public List<List<OutCollectionCategory>> RawMountSets { get; set; }
    public List<List<OutCollectionCategory>> RawPetSets { get; set; }

    //[JsonProperty("rawProgressSets")]
    public List<List<OutProgress>> ProgressSets { get; set; }

    public List<List<OutCollectionCategory>> RawToySets { get; set; }
    public List<List<ManualTransmogCategory>> RawTransmogSets { get; set; }
    public List<List<ManualTransmogSetCategory>> RawTransmogSetsV2 { get; set; }
    public List<List<ManualVendorCategory>> RawVendorSets { get; set; }
    public List<List<ManualZoneMapCategory>> RawZoneMapSets { get; set; }

    // Shared
    public List<ManualSharedItemSet> RawSharedItemSets { get; set; }
    public List<ManualSharedVendor> RawSharedVendors { get; set; }

    // Tags
    public List<object[]> RawTags { get; set; }
}
