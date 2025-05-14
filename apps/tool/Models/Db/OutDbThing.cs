using Wowthing.Tool.Converters.Db;
using Wowthing.Tool.Enums;
using Wowthing.Tool.Models.Vendors;

namespace Wowthing.Tool.Models.Db;

[JsonConverter(typeof(OutDbThingConverter))]
public class OutDbThing
{
    public bool AccountWide { get; set; }
    public int Id { get; set; }
    public int HighlightQuestId { get; set; }
    public int TrackingQuestId { get; set; }
    public int ZoneMapsGroupId { get; set; }
    public string Name { get; set; }
    public string Note { get; set; }
    public DbResetType ResetType { get; set; }
    public DbThingType Type { get; set; }

    public List<OutDbThingContent> Contents { get; } = new();
    public List<ManualSharedVendorSet> Groups { get; } = new();
    public List<OutDbThingLocation> Locations { get; } = new();
    public int[] RequirementIds { get; set; }
    public int[] TagIds { get; set; }

    public OutDbThing(DataDbThing dataThing, IEnumerable<int> thingRequirementIds, IEnumerable<int> thingTagIds)
    {
        RequirementIds = thingRequirementIds.Order().ToArray();
        TagIds = thingTagIds.Order().ToArray();

        AccountWide = dataThing.AccountWide;
        Id = dataThing.Id;
        Name = dataThing.Name;
        Note = dataThing.Note;
        HighlightQuestId = dataThing.HighlightQuestId;
        TrackingQuestId = dataThing.TrackingQuestId;
        ZoneMapsGroupId = dataThing.ZoneMapsGroupId;

        ResetType = Enum.Parse<DbResetType>(dataThing.Reset.OrDefault("none"), true);
        Type = Enum.Parse<DbThingType>(dataThing.Type, true);

        Groups = dataThing.Groups
            .EmptyIfNull()
            .Select(group => new ManualSharedVendorSet(group))
            .ToList();
    }

    public void AddLocation(int mapId, string locationString)
    {
        Locations.Add(new OutDbThingLocation(mapId, locationString));
    }
}
