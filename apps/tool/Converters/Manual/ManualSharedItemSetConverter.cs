using Newtonsoft.Json.Linq;
using Wowthing.Tool.Models.ItemSets;

namespace Wowthing.Tool.Converters.Manual;

public class ManualSharedItemSetConverter : JsonConverter<ManualSharedItemSet>
{
    public override ManualSharedItemSet? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        throw new NotImplementedException();
    }

    public override void Write(Utf8JsonWriter writer, ManualSharedItemSet set, JsonSerializerOptions options)
    {
        writer.WriteStartArray();

        writer.WriteStringValue(set.Name);

        // Slots
        writer.WriteStartArray();
        foreach (var itemIds in set.Items)
        {
            writer.WriteNumberArray(itemIds);
        }
        writer.WriteEndArray();

        writer.WriteNumberArray(set.Tags);

        writer.WriteEndArray();
    }
}
