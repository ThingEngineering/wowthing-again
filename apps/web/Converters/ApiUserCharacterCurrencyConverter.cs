using Wowthing.Web.Models.Api.User;

namespace Wowthing.Web.Converters;

public class ApiUserCharacterCurrencyConverter : JsonConverter<ApiUserCharacterCurrency>
{
    public override ApiUserCharacterCurrency Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        throw new NotImplementedException();
    }

    public override void Write(Utf8JsonWriter writer, ApiUserCharacterCurrency currency, JsonSerializerOptions options)
    {
        writer.WriteStartArray();

        writer.WriteNumberValue(currency.CurrencyId);
        writer.WriteNumberValue(currency.Quantity);
        writer.WriteNumberValue(currency.Max);
        writer.WriteNumberValue(currency.TotalQuantity);
        writer.WriteNumberValue(currency.IsMovingMax ? 1 : 0);
        writer.WriteNumberValue(currency.IsWeekly ? 1 : 0);
        writer.WriteNumberValue(currency.WeekQuantity);
        writer.WriteNumberValue(currency.WeekMax);
        writer.WriteEndArray();
    }
}
