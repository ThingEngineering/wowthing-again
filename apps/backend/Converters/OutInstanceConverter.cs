using System.Text.Json;
using Wowthing.Backend.Models.Data;

namespace Wowthing.Backend.Converters;

public class OutInstanceConverter : System.Text.Json.Serialization.JsonConverter<OutInstance>
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
