using Wowthing.Tool.Models.DruidForms;

namespace Wowthing.Tool.Converters;

public class OutDruidFormGroupConverter : JsonConverter<OutDruidFormGroup>
{
    public override OutDruidFormGroup? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        throw new NotImplementedException();
    }

    public override void Write(Utf8JsonWriter writer, OutDruidFormGroup group, JsonSerializerOptions options)
    {
        writer.WriteStartArray();

        writer.WriteStringValue(group.Name);

        writer.WriteStartArray();
        foreach (var item in group.Items)
        {
            writer.WriteStartArray();
            writer.WriteNumberValue(item.ItemId);
            writer.WriteNumberValue(item.QuestId);
            writer.WriteEndArray();
        }
        writer.WriteEndArray();

        writer.WriteEndArray();
    }
}
