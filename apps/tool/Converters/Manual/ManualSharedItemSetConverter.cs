using Newtonsoft.Json.Linq;

namespace Wowthing.Tool.Converters.Manual;

public class ManualSharedItemSetConverter : JsonConverter
{
    public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
    {
        var set = (ManualSharedItemSet) value;

        var setArray = new JArray();
        setArray.Add(set.Name);

        var slotsArray = new JArray();
        foreach (var itemIds in set.Items)
        {
            var itemsArray = new JArray();
            foreach (var itemId in itemIds)
            {
                itemsArray.Add(itemId);
            }
            slotsArray.Add(itemsArray);
        }
        setArray.Add(slotsArray);

        var tagsArray = new JArray();
        foreach (var tag in set.Tags)
        {
            tagsArray.Add(tag);
        }
        setArray.Add(tagsArray);

        setArray.WriteTo(writer);
    }

    public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
    {
        throw new NotImplementedException();
    }

    public override bool CanConvert(Type objectType)
    {
        return typeof(ManualSharedItemSet) == objectType;
    }

    public override bool CanRead => false;
}
