using Wowthing.Lib.Models.Player;

namespace Wowthing.Lib.Converters;

public class PlayerCharacterAddonDataCurrencyConverter : JsonConverter<PlayerCharacterAddonDataCurrency>
{
    public override PlayerCharacterAddonDataCurrency Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        if (reader.TokenType != JsonTokenType.StartArray)
        {
            throw new JsonException();
        }

        using var document = JsonDocument.ParseValue(ref reader);

        return new PlayerCharacterAddonDataCurrency
        {
            Quantity = document.RootElement[0].GetInt32(),
            Max = document.RootElement[1].GetInt32(),
            WeekQuantity = document.RootElement[2].GetInt32(),
            WeekMax = document.RootElement[3].GetInt32(),
            TotalQuantity = document.RootElement[4].GetInt32(),
            CurrencyId = document.RootElement[5].GetInt16(),
            IsWeekly = document.RootElement[6].GetInt32() == 1,
            IsMovingMax = document.RootElement[7].GetInt32() == 1,
        };
    }

    public override void Write(Utf8JsonWriter writer, PlayerCharacterAddonDataCurrency value, JsonSerializerOptions options)
    {
        writer.WriteStartArray();
        writer.WriteNumberValue(value.Quantity);
        writer.WriteNumberValue(value.Max);
        writer.WriteNumberValue(value.WeekQuantity);
        writer.WriteNumberValue(value.WeekMax);
        writer.WriteNumberValue(value.TotalQuantity);
        writer.WriteNumberValue(value.CurrencyId);
        writer.WriteNumberValue(value.IsWeekly ? 1 : 0);
        writer.WriteNumberValue(value.IsMovingMax ? 1 : 0);
        writer.WriteEndArray();
    }
}
