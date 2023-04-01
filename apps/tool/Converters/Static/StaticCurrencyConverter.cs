using Wowthing.Tool.Models.Static;

namespace Wowthing.Tool.Converters.Static;

public class StaticCurrencyConverter : JsonConverter<StaticCurrency>
{
    public override StaticCurrency Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        throw new NotImplementedException();
    }

    public override void Write(Utf8JsonWriter writer, StaticCurrency value, JsonSerializerOptions options)
    {
        writer.WriteStartArray();
        writer.WriteNumberValue(value.Id);
        writer.WriteNumberValue(value.CategoryId);
        writer.WriteNumberValue(value.MaxPerWeek);
        writer.WriteNumberValue(value.MaxTotal);
        writer.WriteStringValue(value.Name);
        writer.WriteEndArray();
    }
}
