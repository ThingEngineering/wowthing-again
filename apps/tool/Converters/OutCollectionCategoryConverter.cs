using Wowthing.Tool.Models.Collections;

namespace Wowthing.Tool.Converters;

public class OutCollectionCategoryConverter : JsonConverter<OutCollectionCategory>
{
    public override OutCollectionCategory Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        throw new NotImplementedException();
    }

    public override void Write(Utf8JsonWriter writer, OutCollectionCategory category, JsonSerializerOptions options)
    {
        writer.WriteStartArray();

        writer.WriteStringValue(category.Name);
        writer.WriteStringValue(category.Slug);

        writer.WriteStartArray();
        foreach (var group in category.Groups)
        {
            writer.WriteStartArray();
            writer.WriteStringValue(group.Name);

            writer.WriteStartArray();
            foreach (int[] thing in group.Things)
            {
                writer.WriteNumberArray(thing);
            }
            writer.WriteEndArray();

            writer.WriteEndArray();
        }
        writer.WriteEndArray();

        writer.WriteEndArray();
    }
}
