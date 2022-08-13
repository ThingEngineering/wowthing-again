using Newtonsoft.Json.Linq;
using Wowthing.Backend.Models.Data.Illusions;

namespace Wowthing.Backend.Converters;

public class DataIllusionGroupConverter : JsonConverter
{
        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
    {
        var group = (DataIllusionGroup) value;
        var arr = new JArray();
        arr.Add(group.Name);

        var itemsArray = new JArray();
        foreach (var item in group.Items)
        {
            var itemArray = new JArray();
            itemArray.Add(item.Id);

            if (item.Classes?.Count > 0)
            {
                var classArray = new JArray();
                foreach (int classId in item.Classes)
                {
                    classArray.Add(classId);
                }
                itemArray.Add(classArray);
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
        return typeof(DataIllusionGroup) == objectType;
    }

    public override bool CanRead => false;
}
