using Wowthing.Tool.Models.Db;

namespace Wowthing.Tool.Converters.Db;

public class OutDbThingContentConverter : JsonConverter<OutDbThingContent>
{
    public override OutDbThingContent Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        throw new NotImplementedException();
    }

    public override void Write(Utf8JsonWriter writer, OutDbThingContent content, JsonSerializerOptions options)
    {
        writer.WriteStartArray();

        writer.WriteNumberValue((int)content.Type);
        writer.WriteNumberValue(content.Id);
        writer.WriteStringValue(content.Note.EmptyIfNullOrWhitespace());

        writer.WriteNumberArray(content.RequirementIds);
        writer.WriteNumberArray(content.TagIds);

        writer.WriteStartArray();
        foreach ((int currencyId, int currencyCount) in content.Costs)
        {
            writer.WriteStartArray();
            writer.WriteNumberValue(currencyId);
            writer.WriteNumberValue(currencyCount);
            writer.WriteEndArray();
        }
        writer.WriteEndArray();

        writer.WriteEndArray();
    }
}
