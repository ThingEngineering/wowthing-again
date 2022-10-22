using System.Text.Json;
using Wowthing.Web.Models;

namespace Wowthing.Web.Converters;

public class UserApiCharacterCurrencyConverter : System.Text.Json.Serialization.JsonConverter<UserApiCharacterCurrency>
{
    public override UserApiCharacterCurrency Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        throw new NotImplementedException();
    }

    public override void Write(Utf8JsonWriter writer, UserApiCharacterCurrency value, JsonSerializerOptions options)
    {
        writer.WriteStartArray();
        writer.WriteNumberValue(value.Id);
        writer.WriteNumberValue(value.Quantity);
        writer.WriteNumberValue(value.Max);
        writer.WriteNumberValue(value.WeekQuantity);
        writer.WriteNumberValue(value.WeekMax);
        writer.WriteNumberValue(value.TotalQuantity);
        writer.WriteNumberValue(value.IsWeekly ? 1 : 0);
        writer.WriteNumberValue(value.IsMovingMax ? 1 : 0);
        writer.WriteEndArray();
    }
}
