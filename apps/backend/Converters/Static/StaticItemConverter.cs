using Newtonsoft.Json.Linq;
using Wowthing.Backend.Models.Static;

namespace Wowthing.Backend.Converters.Static;

public class StaticItemConverter : JsonConverter
{
    public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
    {
        var item = (StaticItem) value;
        var arr = new JArray();
        arr.Add(item.Id);
        arr.Add(item.Quality);
        arr.Add(item.AppearanceId);
        arr.Add(item.Name);
        arr.WriteTo(writer);
    }

    public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
    {
        throw new NotImplementedException();
    }

    public override bool CanConvert(Type objectType)
    {
        return typeof(StaticItem) == objectType;
    }

    public override bool CanRead => false;

}
