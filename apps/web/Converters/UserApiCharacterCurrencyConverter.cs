using Newtonsoft.Json.Linq;
using Wowthing.Web.Models;

namespace Wowthing.Web.Converters;

public class UserApiCharacterCurrencyConverter : JsonConverter
{
    public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
    {
        var currency = (UserApiCharacterCurrency) value;
        var arr = new JArray();
        arr.Add(currency.Id);
        arr.Add(currency.Quantity);
        arr.Add(currency.Max);
        arr.Add(currency.WeekQuantity);
        arr.Add(currency.WeekMax);
        arr.Add(currency.TotalQuantity);
        arr.Add(currency.IsWeekly ? 1 : 0);
        arr.Add(currency.IsMovingMax ? 1 : 0);
        arr.WriteTo(writer);
    }

    public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
    {
        throw new NotImplementedException();
    }

    public override bool CanConvert(Type objectType)
    {
        return typeof(UserApiCharacterCurrency) == objectType;
    }

    public override bool CanRead => false;
}