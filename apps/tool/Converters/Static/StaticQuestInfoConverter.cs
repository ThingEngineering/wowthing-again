using Wowthing.Tool.Models.Static;

namespace Wowthing.Tool.Converters.Static;

public class StaticQuestInfoConverter : JsonConverter<StaticQuestInfo>
{
    public override StaticQuestInfo Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        throw new NotImplementedException();
    }

    public override void Write(Utf8JsonWriter writer, StaticQuestInfo questInfo, JsonSerializerOptions options)
    {
        writer.WriteStartArray();
        writer.WriteNumberValue(questInfo.Id);
        writer.WriteNumberValue(questInfo.Type);
        writer.WriteNumberValue(questInfo.Flags);
        writer.WriteNumberValue(questInfo.ProfessionId);
        writer.WriteStringValue(questInfo.Name);
        writer.WriteEndArray();
    }
}
