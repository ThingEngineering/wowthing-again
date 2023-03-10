using Newtonsoft.Json.Linq;

namespace Wowthing.Tool.Converters;

public class OutCollectionCategoryConverter : JsonConverter
{
    public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
    {
        var category = (OutCollectionCategory) value;
        var arr = new JArray();
        arr.Add(category.Name);
        arr.Add(category.Slug);
        arr.Add(
            new JArray(
                category.Groups.Select(group => new JArray(
                    group.Name,
                    new JArray(
                        group.Things
                            .Select(thing => new JArray(thing))
                    )
                ))
            )
        );
        arr.WriteTo(writer);
    }

    public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
    {
        throw new NotImplementedException();
    }

    public override bool CanConvert(Type objectType)
    {
        return typeof(OutCollectionCategory) == objectType;
    }

    public override bool CanRead => false;
}