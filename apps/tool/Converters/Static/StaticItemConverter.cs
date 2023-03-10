using Newtonsoft.Json.Linq;

namespace Wowthing.Tool.Converters.Static;

public class StaticItemConverter : JsonConverter
{
    public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
    {
        var item = (StaticItem) value;
        var arr = new JArray();
        arr.Add(item.Id);
        arr.Add(item.InventoryType);
        arr.Add(item.Quality);

        var appearArray = new JArray();
        foreach (var (modifier, appearanceId) in item.AppearanceIds.EmptyIfNull())
        {
            var modArray = new JArray();
            modArray.Add(modifier);
            modArray.Add(appearanceId);
            appearArray.Add(modArray);
        }
        arr.Add(appearArray);

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
