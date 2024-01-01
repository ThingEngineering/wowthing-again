using Wowthing.Tool.Models.Heirlooms;

namespace Wowthing.Tool.Converters.Manual;

public class DataHeirloomGroupConverter : JsonConverter<DataHeirloomGroup>
{
    public override DataHeirloomGroup Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        throw new NotImplementedException();
    }

    public override void Write(Utf8JsonWriter writer, DataHeirloomGroup group, JsonSerializerOptions options)
    {
        writer.WriteStartArray();

        writer.WriteStringValue(group.Name);

        // Items
        writer.WriteStartArray();
        foreach (var item in group.Items)
        {
            writer.WriteStartArray();

            writer.WriteNumberValue(item.Id);

            if (!string.IsNullOrWhiteSpace(item.Faction))
            {
                writer.WriteStringValue(item.Faction);
            }

            writer.WriteEndArray();
        }
        writer.WriteEndArray();

        writer.WriteEndArray();
    }
}
