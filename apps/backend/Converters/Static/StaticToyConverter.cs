using System.Text.Json;
using Wowthing.Backend.Models.Static;

namespace Wowthing.Backend.Converters.Static;

public class StaticToyConverter : System.Text.Json.Serialization.JsonConverter<StaticToy>
{
    public override StaticToy Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        throw new NotImplementedException();
    }

    public override void Write(Utf8JsonWriter writer, StaticToy value, JsonSerializerOptions options)
    {
        writer.WriteStartArray();
        writer.WriteNumberValue(value.Id);
        writer.WriteNumberValue(value.SourceType);
        writer.WriteNumberValue(value.ItemId);
        writer.WriteStringValue(value.Name);
        writer.WriteEndArray();
    }
}
