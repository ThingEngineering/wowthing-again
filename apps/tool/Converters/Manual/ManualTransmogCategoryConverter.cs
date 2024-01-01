using Wowthing.Tool.Models.Transmog;

namespace Wowthing.Tool.Converters.Manual;

public class ManualTransmogCategoryConverter : JsonConverter<ManualTransmogCategory>
{

    public override ManualTransmogCategory Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        throw new NotImplementedException();
    }

    public override void Write(Utf8JsonWriter writer, ManualTransmogCategory category, JsonSerializerOptions options)
    {
        writer.WriteStartArray();

        writer.WriteStringValue(category.Name);
        writer.WriteStringValue(category.Slug);

        writer.WriteObjectArray(category.Groups, WriteGroupArray);

        if (category.SkipClasses?.Count > 0)
        {
            writer.WriteStringArray(category.SkipClasses);
        }

        writer.WriteEndArray();
    }

    private void WriteGroupArray(Utf8JsonWriter writer, ManualTransmogGroup group)
    {
        writer.WriteStartArray();

        writer.WriteStringValue(group.Name);
        writer.WriteStringValue(group.Type);

        writer.WriteStringArray(group.Sets);

        // Data
        writer.WriteStartArray();
        foreach (var (key, sets) in group.Data)
        {
            writer.WriteStartArray();
            writer.WriteStringValue(key);
            writer.WriteObjectArray(sets, WriteSetArray);
            writer.WriteEndArray();
        }
        writer.WriteEndArray();

        if (!string.IsNullOrWhiteSpace(group.Tag))
        {
            writer.WriteStringValue(group.Tag);
        }

        writer.WriteEndArray();
    }

    private void WriteSetArray(Utf8JsonWriter writer, ManualTransmogSet set)
    {
        bool useAchievementId = set.AchievementId > 0;
        bool useTransmogSetId = set.TransmogSetId > 0;
        bool useWowheadSetId = set.WowheadSetId > 0;

        writer.WriteStartArray();
        writer.WriteStringValue(set.Name);

        // Items
        writer.WriteStartObject();
        foreach (var (key, items) in set.Items)
        {
            writer.WritePropertyName(key);
            writer.WriteNumberArray(items);
        }
        writer.WriteEndObject();

        if (useAchievementId || useTransmogSetId || useWowheadSetId)
        {
            writer.WriteNumberValue(set.WowheadSetId);
        }

        if (useAchievementId || useTransmogSetId)
        {
            writer.WriteNumberValue(set.TransmogSetId);
        }

        if (useAchievementId)
        {
            writer.WriteNumberValue(set.AchievementId);
        }

        writer.WriteEndArray();
    }
}
