using Wowthing.Tool.Enums;

namespace Wowthing.Tool.Models.Db;

public class OutDbThing
{
    public int TrackingQuestId { get; set; }
    public string Name { get; set; }
    public DbResetType ResetType { get; set; }
    public DbThingType Type { get; set; }

    public List<OutDbThingLocation> Locations { get; } = new();
    public int[] RequirementIds { get; set; }
    public int[] TagIds { get; set; }

    public OutDbThing(DataDbThing dataThing, IEnumerable<int> thingRequirementIds, IEnumerable<int> thingTagIds)
    {
        RequirementIds = thingRequirementIds.OrderBy(t => t).ToArray();
        TagIds = thingTagIds.OrderBy(t => t).ToArray();

        Name = dataThing.Name;
        TrackingQuestId = dataThing.TrackingQuestId;

        ResetType = Enum.Parse<DbResetType>(string.IsNullOrEmpty(dataThing.Reset) ? "none" : dataThing.Reset, true);
        Type = Enum.Parse<DbThingType>(dataThing.Type, true);
    }

    public void AddLocation(int mapId, string locationString)
    {
        Locations.Add(new OutDbThingLocation(mapId, locationString));
    }
}
