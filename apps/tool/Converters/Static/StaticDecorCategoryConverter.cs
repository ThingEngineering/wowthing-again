using Wowthing.Tool.Models.Housing;

namespace Wowthing.Tool.Converters.Static;

public class StaticDecorCategoryConverter : JsonConverter<StaticDecorCategory>
{
    public override StaticDecorCategory? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        throw new NotImplementedException();
    }

    public override void Write(Utf8JsonWriter writer, StaticDecorCategory category, JsonSerializerOptions options)
    {
        writer.WriteStartArray();

        writer.WriteNumberValue(category.Id);
        writer.WriteStringValue(category.Name);

        writer.WriteStartArray();
        foreach (var subCategory in category.Subcategories)
        {
            WriteSubCategory(writer, subCategory);
        }
        writer.WriteEndArray();

        writer.WriteEndArray();
    }

    private void WriteSubCategory(Utf8JsonWriter writer, StaticDecorSubcategory subCategory)
    {
        writer.WriteStartArray();

        writer.WriteNumberValue(subCategory.Id);
        writer.WriteStringValue(subCategory.Name);

        writer.WriteStartArray();
        foreach (var decor in subCategory.Decors)
        {
            WriteDecor(writer, decor);
        }
        writer.WriteEndArray();

        writer.WriteEndArray();
    }

    private void WriteDecor(Utf8JsonWriter writer, StaticDecorObject decor)
    {
        writer.WriteStartArray();

        writer.WriteNumberValue(decor.Id);
        writer.WriteNumberValue(decor.Type);
        writer.WriteNumberValue(decor.ItemId);
        writer.WriteStringValue(decor.Name);

        writer.WriteEndArray();
    }
}
