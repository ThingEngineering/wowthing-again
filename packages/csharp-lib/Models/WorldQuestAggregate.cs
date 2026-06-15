using Wowthing.Lib.Converters;

namespace Wowthing.Lib.Models;

[JsonConverter(typeof(WorldQuestAggregateConverter))]
public class WorldQuestAggregate
{
    // 4 bytes
    public int ZoneId { get; set; }
    public int QuestId { get; set; }
    public short Region { get; set; }

    // variable
    public string JsonData { get; set; }
}
