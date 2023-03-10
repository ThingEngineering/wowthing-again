using Newtonsoft.Json.Linq;

namespace Wowthing.Tool.Converters;

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

            if (!string.IsNullOrEmpty(item.Classes))
            {
                var classArray = new JArray();
                foreach (string classId in item.Classes.Split(' '))
                {
                    classArray.Add(int.Parse(classId));
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
