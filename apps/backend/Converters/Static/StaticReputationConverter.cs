using System.Text.Json;
using Newtonsoft.Json.Linq;
using Wowthing.Backend.Models.Static;
using JsonSerializer = Newtonsoft.Json.JsonSerializer;

namespace Wowthing.Backend.Converters.Static;

public class StaticReputationConverter : System.Text.Json.Serialization.JsonConverter<StaticReputation>
{
    public override StaticReputation Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        throw new NotImplementedException();
    }

    public override void Write(Utf8JsonWriter writer, StaticReputation value, JsonSerializerOptions options)
    {
        writer.WriteStartArray();
        writer.WriteNumberValue(value.Id);
        writer.WriteNumberValue(value.Expansion);
        writer.WriteNumberValue(value.TierId);
        writer.WriteNumberValue(value.ParentId);
        writer.WriteNumberValue(value.ParagonId);
        writer.WriteStringValue(value.Name);

        if (!string.IsNullOrWhiteSpace(value.Description))
        {
            writer.WriteStringValue(value.Description);
        }

        writer.WriteEndArray();
    }
}
