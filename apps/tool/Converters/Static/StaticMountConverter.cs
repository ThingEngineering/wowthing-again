using Wowthing.Tool.Models.Static;

namespace Wowthing.Tool.Converters.Static;

public class StaticMountConverter : JsonConverter<StaticMount>
{
    public override StaticMount Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        throw new NotImplementedException();
    }

    public override void Write(Utf8JsonWriter writer, StaticMount value, JsonSerializerOptions options)
    {
        writer.WriteStartArray();
        writer.WriteNumberValue(value.Id);
        writer.WriteNumberValue(value.SourceType);
        writer.WriteNumberValue(value.ItemId);
        writer.WriteNumberValue(value.SpellId);
        writer.WriteStringValue(value.Name);
        writer.WriteEndArray();
    }
}
