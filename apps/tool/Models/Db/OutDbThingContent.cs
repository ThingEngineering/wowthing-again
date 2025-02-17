using Wowthing.Tool.Converters.Db;
using Wowthing.Tool.Enums;

namespace Wowthing.Tool.Models.Db;

[JsonConverter(typeof(OutDbThingContentConverter))]
public class OutDbThingContent
{
    public int Id { get; }
    public int TrackingQuestId { get; }
    public string? Note { get; }
    public DbThingContentType Type { get; }
    public int[] RequirementIds { get; }
    public int[] TagIds { get; }
    public Dictionary<int, int> Costs { get; }

    public OutDbThingContent(DataDbThingContent dataContent, IEnumerable<int> thingRequirementIds, IEnumerable<int> thingTagIds)
    {
        RequirementIds = thingRequirementIds.Order().ToArray();
        TagIds = thingTagIds.Order().ToArray();

        Id = dataContent.Id;
        TrackingQuestId = dataContent.TrackingQuestId;
        Note = dataContent.Note;

        Costs = dataContent.Costs.EmptyIfNull();

        Type = Enum.Parse<DbThingContentType>(dataContent.Type.OrDefault("item"), true);
    }
}
