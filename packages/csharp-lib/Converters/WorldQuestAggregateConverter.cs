using Wowthing.Lib.Models;

namespace Wowthing.Lib.Converters;

public class WorldQuestAggregateConverter : JsonConverter<WorldQuestAggregate>
{
    public override WorldQuestAggregate Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        throw new NotImplementedException();
    }

    public override void Write(Utf8JsonWriter writer, WorldQuestAggregate aggregate, JsonSerializerOptions options)
    {
        writer.WriteStartArray();
        writer.WriteNumberValue(aggregate.QuestId);
        writer.WriteStringValue(aggregate.JsonData);
        writer.WriteEndArray();
    }
}
