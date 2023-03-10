using Wowthing.Tool.Models;

namespace Wowthing.Tool.Converters;

public class OutInstanceConverter : JsonConverter<OutInstance>
{
    public override OutInstance Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        throw new NotImplementedException();
    }

    public override void Write(Utf8JsonWriter writer, OutInstance value, JsonSerializerOptions options)
    {
        writer.WriteStartArray();
        writer.WriteNumberValue(value.Id);
        writer.WriteNumberValue(value.Expansion);
        writer.WriteStringValue(value.Name);
        writer.WriteStringValue(value.ShortName);
        writer.WriteEndArray();
    }
}
