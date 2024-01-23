using System.Text.Json;
using System.Text.Json.Serialization;
using Wowthing.Lib.Models.Wow;

namespace Wowthing.Lib.Converters;

public class WowRealmConverter : JsonConverter<WowRealm>
{
    public override WowRealm Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        throw new NotImplementedException();
    }

    public override void Write(Utf8JsonWriter writer, WowRealm value, JsonSerializerOptions options)
    {
        writer.WriteStartArray();
        writer.WriteNumberValue(value.Id);
        writer.WriteNumberValue((int)value.Region);
        writer.WriteNumberValue(value.ConnectedRealmId);
        writer.WriteStringValue(value.Name);
        writer.WriteStringValue(value.Slug);

        writer.WriteStringValue(value.Locale);

        if (value.EnglishName != null)
        {
            writer.WriteStringValue(value.EnglishName);
        }

        writer.WriteEndArray();
    }
}
