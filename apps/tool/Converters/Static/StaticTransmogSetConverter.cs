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
        foreach (var (modifier, itemIds) in value.ItemsByModifier)
        {
            writer.WriteStartArray();
            writer.WriteNumberValue(modifier);

            int lastId = 0;
            foreach (int itemId in itemIds.Order())
            {
                writer.WriteNumberValue(itemId - lastId);
                lastId = itemId;
            }

            writer.WriteEndArray();
        }
        writer.WriteEndArray();

        writer.WriteEndArray();
    }
}
