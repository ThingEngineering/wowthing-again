using Newtonsoft.Json.Linq;
using Wowthing.Backend.Models.Static;

namespace Wowthing.Backend.Converters.Static;

public class StaticReputationConverter : JsonConverter
{
    public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
    {
        var instance = (StaticReputation) value;
        var arr = new JArray();
        arr.Add(instance.Id);
        arr.Add(instance.Expansion);
        arr.Add(instance.TierId);
        arr.Add(instance.ParentId);
        arr.Add(instance.ParagonId);
        arr.Add(instance.Name);
        if (!string.IsNullOrWhiteSpace(instance.Description))
        {
            arr.Add(instance.Description);
        }
        arr.WriteTo(writer);
    }

    public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
    {
        throw new NotImplementedException();
    }

    public override bool CanConvert(Type objectType)
    {
        return typeof(StaticReputation) == objectType;
    }

    public override bool CanRead => false;
}
