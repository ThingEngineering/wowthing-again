using Wowthing.Tool.Models.Static;

namespace Wowthing.Tool.Converters.Static;

public class StaticMountConverter : JsonConverter<StaticMount>
{
    public override StaticMount Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        throw new NotImplementedException();
    }

    public override void Write(Utf8JsonWriter writer, StaticMount mount, JsonSerializerOptions options)
    {
        writer.WriteStartArray();
        writer.WriteNumberValue(mount.Id);
        writer.WriteNumberValue(mount.SourceType);
        writer.WriteNumberValue(mount.SpellId);
        writer.WriteStringValue(mount.Name);
        writer.WriteNumberArray(mount.ItemIds);
        writer.WriteEndArray();
    }
}
