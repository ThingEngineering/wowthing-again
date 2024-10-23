using Wowthing.Tool.Models.Db;

namespace Wowthing.Tool.Converters.Db;

public class OutDbThingConverter : JsonConverter<OutDbThing>
{
    public override OutDbThing Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        throw new NotImplementedException();
    }

    public override void Write(Utf8JsonWriter writer, OutDbThing thing, JsonSerializerOptions options)
    {
        writer.WriteStartArray();

        writer.WriteNumberValue((int)thing.Type);
        writer.WriteNumberValue(thing.Id);
        writer.WriteNumberValue((int)thing.ResetType);
        writer.WriteNumberValue(thing.TrackingQuestId);
        writer.WriteNumberValue(thing.ZoneMapsGroupId);
        writer.WriteStringValue(thing.Name);
        writer.WriteStringValue(thing.Note);

        writer.WriteNumberArray(thing.RequirementIds);
        writer.WriteNumberArray(thing.TagIds);

        writer.WriteStartArray();
        foreach (var location in thing.Locations)
        {
            writer.WriteStartArray();
            writer.WriteNumberValue(location.MapId);
            writer.WriteNumberValue(location.PackedLocation);
            writer.WriteEndArray();
        }
        writer.WriteEndArray();

        writer.WriteStartArray();
        foreach (var content in thing.Contents)
        {
            JsonSerializer.Serialize(writer, content, options);
        }
        writer.WriteEndArray();

        writer.WriteStartArray();
        foreach (var group in thing.Groups)
        {
            writer.WriteStartArray();

            writer.WriteStringValue(group.Name);
            writer.WriteNumberArray(group.Range);

            if (group.BonusIds.Length > 0 || !string.IsNullOrWhiteSpace(group.SortKey))
            {
                writer.WriteStringValue(group.SortKey);
            }

            if (group.BonusIds.Length > 0)
            {
                writer.WriteNumberArray(group.BonusIds);
            }

            writer.WriteEndArray();
        }
        writer.WriteEndArray();

        writer.WriteEndArray();
    }
}
