using Wowthing.Tool.Models.Static;

namespace Wowthing.Tool.Converters.Static;

public class StaticQuestLineConverter : JsonConverter<StaticQuestLine>
{
    public override StaticQuestLine? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        throw new NotImplementedException();
    }

    public override void Write(Utf8JsonWriter writer, StaticQuestLine questLine, JsonSerializerOptions options)
    {
        writer.WriteStartArray();

        writer.WriteNumberValue(questLine.Id);
        writer.WriteNumberArray(questLine.QuestIds);

        writer.WriteEndArray();
    }
}
