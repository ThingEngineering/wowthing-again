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

        bool useQuantity = currency.Quantity > 0;
        bool useMax = currency.Max > 0;
        bool useTotalQuantity = currency.TotalQuantity > 0;
        bool useIsMovingMax = currency.IsMovingMax;
        bool useWeekly = currency.IsWeekly;

        if (useWeekly || useIsMovingMax || useTotalQuantity || useMax || useQuantity)
        {
            writer.WriteNumberValue(currency.Quantity);
        }

        if (useWeekly || useIsMovingMax || useTotalQuantity || useMax)
        {
            writer.WriteNumberValue(currency.Max);
        }

        if (useWeekly || useIsMovingMax || useTotalQuantity)
        {
            writer.WriteNumberValue(currency.TotalQuantity);
        }

        if (useWeekly || useIsMovingMax)
        {
            writer.WriteNumberValue(currency.IsMovingMax ? 1 : 0);
        }

        if (useWeekly)
        {
            writer.WriteNumberValue(currency.IsWeekly ? 1 : 0);
            writer.WriteNumberValue(currency.WeekQuantity);
            writer.WriteNumberValue(currency.WeekMax);
        }

        writer.WriteEndArray();
    }
}
