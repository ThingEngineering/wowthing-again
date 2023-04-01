using Wowthing.Tool.Models.Appearances;

namespace Wowthing.Tool.Converters.Appearances;

public class RedisAppearanceDataConverter : JsonConverter<RedisAppearanceData>
{
    public override RedisAppearanceData Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        throw new NotImplementedException();
    }

    public override void Write(Utf8JsonWriter writer, RedisAppearanceData rad, JsonSerializerOptions options)
    {
        writer.WriteStartArray();

        writer.WriteNumberValue(rad.Appearance!.ID);

        writer.WriteStartArray();
        foreach (var (modifiedAppearance, quality) in rad.ModifiedAppearances.OrderBy(mod => mod.Item1.Order))
        {
            writer.WriteStartArray();
            writer.WriteNumberValue(modifiedAppearance.ItemId);
            writer.WriteNumberValue((int)quality);
            writer.WriteNumberValue(modifiedAppearance.Modifier);
            writer.WriteEndArray();
        }
        writer.WriteEndArray();

        writer.WriteEndArray();
    }
}
