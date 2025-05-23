﻿using Wowthing.Tool.Models.Vendors;

namespace Wowthing.Tool.Models.Db;

public class DataDbThing
{
    public bool AccountWide { get; set; }
    public int Id { get; set; }
    public int HighlightQuestId { get; set; }
    public int TrackingQuestId { get; set; }
    public int WorldQuestId { get; set; }
    public int ZoneMapsGroupId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Note { get; set; } = string.Empty;
    public string Reset { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;

    public DataDbThingContent[]? Contents { get; set; }
    public DataSharedVendorSet[]? Groups { get; set; }
    public Dictionary<string, string[]>? Locations { get; set; }
    public string[]? Requirements { get; set; }
    public string[]? Tags { get; set; }
}
