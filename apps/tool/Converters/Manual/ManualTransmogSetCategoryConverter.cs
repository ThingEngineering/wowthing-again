using Wowthing.Tool.Models.TransmogSets;

namespace Wowthing.Tool.Converters.Manual;

public class ManualTransmogSetCategoryConverter : JsonConverter<ManualTransmogSetCategory>
{
    public override ManualTransmogSetCategory? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        throw new NotImplementedException();
    }

    public override void Write(Utf8JsonWriter writer, ManualTransmogSetCategory category, JsonSerializerOptions options)
    {
        writer.WriteStartArray();

        writer.WriteStringValue(category.Name);
        writer.WriteStringValue(category.Slug);

        writer.WriteObjectArray(category.Groups.EmptyIfNull(), WriteGroupArray);

        writer.WriteEndArray();
    }

    private void WriteGroupArray(Utf8JsonWriter writer, ManualTransmogSetGroup group)
    {
        writer.WriteStartArray();

        writer.WriteNumberValue((int)group.Type);
        writer.WriteStringValue(group.Name);
        writer.WriteNumberValue((int)group.MatchType);

        writer.WriteNumberArray(group.MatchTags.EmptyIfNull());

        writer.WriteObjectArray(group.Sets, WriteSetArray);

        bool usePrefix = !string.IsNullOrWhiteSpace(group.Prefix);
        bool useBonusIds = group.BonusIds != null;
        bool useCompletionist = group.Completionist.HasValue;

        if (useCompletionist || useBonusIds || usePrefix)
        {
            writer.WriteStringValue(group.Prefix);
        }

        if (useCompletionist || useBonusIds)
        {
            writer.WriteStartArray();
            foreach ((int key, var bonusIds) in group.BonusIds.EmptyIfNull())
            {
                writer.WriteStartArray();
                writer.WriteNumberValue(key);
                writer.WriteNumberArray(bonusIds);
                writer.WriteEndArray();
            }
            writer.WriteEndArray();
        }

        if (useCompletionist)
        {
            writer.WriteBooleanValue(group.Completionist.Value);
        }

        writer.WriteEndArray();
    }

    private void WriteSetArray(Utf8JsonWriter writer, ManualTransmogSetSet set)
    {
        writer.WriteStartArray();

        writer.WriteStringValue(set.Name);

        writer.WriteNumberArray(set.MatchTags.EmptyIfNull());

        bool useCompletionist = set.Completionist.HasValue;
        bool useModifier = set.Modifier.HasValue;

        if (useCompletionist || useModifier)
        {
            writer.WriteNumberValue(set.Modifier ?? 0);
        }

        if (useCompletionist)
        {
            writer.WriteBooleanValue(set.Completionist!.Value);
        }

        writer.WriteEndArray();
    }
}
