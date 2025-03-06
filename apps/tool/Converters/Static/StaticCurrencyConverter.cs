using Wowthing.Tool.Models.Static;

namespace Wowthing.Tool.Converters.Static;

public class StaticCurrencyConverter : JsonConverter<StaticCurrency>
{
    public override StaticCurrency Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        throw new NotImplementedException();
    }

    public override void Write(Utf8JsonWriter writer, StaticCurrency currency, JsonSerializerOptions options)
    {
        writer.WriteStartArray();
        writer.WriteNumberValue(currency.Id);
        writer.WriteNumberValue(currency.CategoryId);
        writer.WriteNumberValue(currency.MaxPerWeek);
        writer.WriteNumberValue(currency.MaxTotal);
        writer.WriteNumberValue(currency.RechargeAmount);
        writer.WriteNumberValue(currency.RechargeInterval);
        writer.WriteNumberValue(currency.TransferPercent);
        writer.WriteStringValue(currency.Name);
        writer.WriteStringValue(currency.Description);
        writer.WriteEndArray();
    }
}
