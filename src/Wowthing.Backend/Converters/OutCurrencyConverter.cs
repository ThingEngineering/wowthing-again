using Newtonsoft.Json.Linq;
using Wowthing.Backend.Models.Data;

namespace Wowthing.Backend.Converters
{
    public class OutCurrencyConverter : JsonConverter
    {
        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            var currency = (OutCurrency) value;
            var arr = new JArray();
            arr.Add(currency.Id);
            arr.Add(currency.CategoryId);
            arr.Add(currency.MaxPerWeek);
            arr.Add(currency.MaxTotal);
            arr.Add(currency.Name);
            arr.WriteTo(writer);
        }

        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
            throw new NotImplementedException();
        }

        public override bool CanConvert(Type objectType)
        {
            return typeof(OutCurrency) == objectType;
        }

        public override bool CanRead => false;
    }
}
