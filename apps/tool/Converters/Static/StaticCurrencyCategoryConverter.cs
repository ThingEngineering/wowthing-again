using Wowthing.Tool.Models.Static;

namespace Wowthing.Tool.Converters.Static;

public class StaticCurrencyCategoryConverter : JsonConverter<StaticCurrencyCategory>
{
    public override StaticCurrencyCategory Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        throw new NotImplementedException();
    }

    public override void Write(Utf8JsonWriter writer, StaticCurrencyCategory value, JsonSerializerOptions options)
    {
        writer.WriteStartArray();
        writer.WriteNumberValue(value.Id);
        writer.WriteStringValue(value.Name);
        writer.WriteStringValue(value.Slug);
        writer.WriteEndArray();
    }
}
