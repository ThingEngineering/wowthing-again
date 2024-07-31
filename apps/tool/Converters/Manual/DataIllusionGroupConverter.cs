using Wowthing.Tool.Models.Illusions;

namespace Wowthing.Tool.Converters.Manual;

public class DataIllusionGroupConverter : JsonConverter<DataIllusionGroup>
{
    public override DataIllusionGroup Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        throw new NotImplementedException();
    }

    public override void Write(Utf8JsonWriter writer, DataIllusionGroup group, JsonSerializerOptions options)
    {
        writer.WriteStartArray();

        writer.WriteStringValue(group.Name);

        // Items
        writer.WriteStartArray();
        foreach (var item in group.Items)
        {
            writer.WriteStartArray();

            writer.WriteNumberValue(item.Id);

            if (!string.IsNullOrEmpty(item.Classes))
            {
                writer.WriteNumberArray(item.Classes.Split(' ').Select(int.Parse));
            }

            writer.WriteEndArray();
        }
        writer.WriteEndArray();

        writer.WriteEndArray();
    }
}
