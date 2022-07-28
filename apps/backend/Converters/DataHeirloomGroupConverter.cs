using Newtonsoft.Json.Linq;
using Wowthing.Backend.Models.Data.Heirlooms;

namespace Wowthing.Backend.Converters;

public class DataHeirloomGroupConverter : JsonConverter
{
        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
    {
        var group = (DataHeirloomGroup) value;
        var arr = new JArray();
        arr.Add(group.Name);

        var itemsArray = new JArray();
        foreach (var item in group.Items)
        {
            var itemArray = new JArray();
            itemArray.Add(item.Id);
            itemArray.Add(item.Upgrades);

            if (!string.IsNullOrWhiteSpace(item.Faction))
            {
                itemArray.Add(item.Faction);
            }

            itemsArray.Add(itemArray);
        }
        arr.Add(itemsArray);

        arr.WriteTo(writer);
    }

    public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
    {
        throw new NotImplementedException();
    }

    public override bool CanConvert(Type objectType)
    {
        return typeof(DataHeirloomGroup) == objectType;
    }

    public override bool CanRead => false;

}
