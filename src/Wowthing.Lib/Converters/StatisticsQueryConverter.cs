using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Wowthing.Lib.Models.Query;

namespace Wowthing.Lib.Converters;

public class StatisticsQueryConverter : JsonConverter
{
    public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
    {
        var stat = (StatisticsQuery)value;
        var arr = new JArray();
        arr.Add(stat.CharacterId);
        arr.Add(stat.Quantity);
        if (stat.Description != null)
        {
            arr.Add(stat.Description);
        }
        arr.WriteTo(writer);
    }

    public override object ReadJson(JsonReader reader, Type objectType, object existingValue,
        JsonSerializer serializer)
    {
        throw new NotImplementedException();
    }

    public override bool CanConvert(Type objectType)
    {
        return typeof(StatisticsQuery) == objectType;
    }

    public override bool CanRead => false;
}
