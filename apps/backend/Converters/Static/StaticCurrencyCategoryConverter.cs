using Newtonsoft.Json.Linq;
using Wowthing.Backend.Models.Static;

namespace Wowthing.Backend.Converters.Static;

public class StaticCurrencyCategoryConverter : JsonConverter
{
    public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
    {
        var category = (StaticCurrencyCategory) value;
        var arr = new JArray();
        arr.Add(category.Id);
        arr.Add(category.Name);
        arr.Add(category.Slug);
        arr.WriteTo(writer);
    }

    public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
    {
        throw new NotImplementedException();
    }

    public override bool CanConvert(Type objectType)
    {
        return typeof(StaticCurrencyCategory) == objectType;
    }

    public override bool CanRead => false;
}