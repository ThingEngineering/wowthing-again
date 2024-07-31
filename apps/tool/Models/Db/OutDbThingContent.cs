using Wowthing.Tool.Converters.Db;
using Wowthing.Tool.Enums;

namespace Wowthing.Tool.Models.Db;

[JsonConverter(typeof(OutDbThingContentConverter))]
public class OutDbThingContent
{
    public int Id { get; set; }
    public string? Note { get; set; }
    public DbThingContentType Type { get; set; }
    public int[] RequirementIds { get; set; }
    public int[] TagIds { get; set; }
    public Dictionary<int, int> Costs { get; set; }

    public OutDbThingContent(DataDbThingContent dataContent, IEnumerable<int> thingRequirementIds, IEnumerable<int> thingTagIds)
    {
        RequirementIds = thingRequirementIds.Order().ToArray();
        TagIds = thingTagIds.Order().ToArray();

        Id = dataContent.Id;
        Note = dataContent.Note;

        Costs = dataContent.Costs.EmptyIfNull();

        Type = Enum.Parse<DbThingContentType>(dataContent.Type.OrDefault("item"), true);
    }
}
