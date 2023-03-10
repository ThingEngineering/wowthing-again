using Newtonsoft.Json.Linq;

namespace Wowthing.Tool.Converters;

public class RedisStaticAppearanceDataConverter : JsonConverter
{
    public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
    {
        var rsa = (RedisStaticAppearanceData) value;
        var arr = new JArray();

        arr.Add(rsa.Appearance.ID);

        var modifiedAppearancesArray = new JArray();
        foreach (var (modifiedAppearance, quality) in rsa.ModifiedAppearances.OrderBy(mod => mod.Item1.Order))
        {
            var maArray = new JArray();
            maArray.Add(modifiedAppearance.ItemId);
            maArray.Add((int)quality);
            maArray.Add(modifiedAppearance.Modifier);
            modifiedAppearancesArray.Add(maArray);
        }
        arr.Add(modifiedAppearancesArray);

        arr.WriteTo(writer);
    }

    public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
    {
        throw new NotImplementedException();
    }

    public override bool CanConvert(Type objectType)
    {
        return typeof(RedisStaticAppearances) == objectType;
    }

    public override bool CanRead => false;
}
