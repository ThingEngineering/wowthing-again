using Wowthing.Tool.Models.Customizations;

namespace Wowthing.Tool.Converters.Manual;

public class ManualCustomizationCategoryConverter : JsonConverter<ManualCustomizationCategory>
{
    public override ManualCustomizationCategory Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        throw new NotImplementedException();
    }

    public override void Write(Utf8JsonWriter writer, ManualCustomizationCategory category, JsonSerializerOptions options)
    {
        writer.WriteStartArray();

        writer.WriteStringValue(category.Name);
        writer.WriteStringValue(category.Slug);

        writer.WriteObjectArray(category.Groups, WriteGroupArray);

        writer.WriteEndArray();
    }

    private void WriteGroupArray(Utf8JsonWriter writer, ManualCustomizationGroup group)
    {
        writer.WriteStartArray();

        writer.WriteStringValue(group.Name);

        writer.WriteObjectArray(group.Things, WriteThingArray);

        writer.WriteEndArray();
    }

    private void WriteThingArray(Utf8JsonWriter writer, ManualCustomizationThing thing)
    {
        writer.WriteStartArray();

        writer.WriteNumberValue(thing.AchievementId);
        writer.WriteNumberValue(thing.ItemId);
        writer.WriteNumberValue(thing.QuestId);
        writer.WriteStringValue(thing.Name);

        writer.WriteEndArray();
    }
}
