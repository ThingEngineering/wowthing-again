using Wowthing.Tool.Models.Static;

namespace Wowthing.Tool.Converters.Static;

public class StaticTransmogSetConverter : JsonConverter<StaticTransmogSet>
{
    public override StaticTransmogSet Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        throw new NotImplementedException();
    }

    public override void Write(Utf8JsonWriter writer, StaticTransmogSet value, JsonSerializerOptions options)
    {
        writer.WriteStartArray();
        writer.WriteNumberValue(value.Id);
        writer.WriteStringValue(value.Name);
        writer.WriteNumberValue(value.ClassMask);
        writer.WriteNumberValue(value.Flags);
        // writer.WriteNumberValue(value.GroupId);
        // writer.WriteNumberValue(value.ItemNameDescriptionId);

        writer.WriteStartArray();
        foreach (var itemInfo in value.Items)
        {
            writer.WriteStartArray();
            writer.WriteNumberValue(itemInfo[0]);
            if (itemInfo[1] > 0)
            {
                writer.WriteNumberValue(itemInfo[1]);
            }
            writer.WriteEndArray();
        }
        writer.WriteEndArray();

        writer.WriteEndArray();
    }
}
