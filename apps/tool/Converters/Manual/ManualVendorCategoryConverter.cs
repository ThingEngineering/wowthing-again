using Wowthing.Tool.Models.Vendors;

namespace Wowthing.Tool.Converters.Manual;

public class ManualVendorCategoryConverter : JsonConverter<ManualVendorCategory>
{
    public override ManualVendorCategory Read(ref Utf8JsonReader reader, Type typeToConvert,
        JsonSerializerOptions options)
    {
        throw new NotImplementedException();
    }

    public override void Write(Utf8JsonWriter writer, ManualVendorCategory category, JsonSerializerOptions options)
    {
        writer.WriteStartArray();

        writer.WriteStringValue(category.Name);
        writer.WriteStringValue(category.Slug);

        writer.WriteObjectArray(category.Groups, WriteGroupArray);

        writer.WriteStringArray(category.VendorMaps);
        writer.WriteStringArray(category.VendorSets);
        writer.WriteStringArray(category.VendorTags);

        writer.WriteStartArray();
        foreach (var child in category.Children)
        {
            JsonSerializer.Serialize(writer, child, options);
        }
        writer.WriteEndArray();

        writer.WriteEndArray();
    }

    private void WriteGroupArray(Utf8JsonWriter writer, ManualVendorGroup group)
    {
        writer.WriteStartArray();

        writer.WriteStringValue(group.Name);

        writer.WriteStartArray();
        foreach (var item in group.Things)
        {
            ManualSharedVendorConverter.WriteItemArray(writer, item);
        }
        writer.WriteEndArray();

        writer.WriteEndArray();
    }
}
