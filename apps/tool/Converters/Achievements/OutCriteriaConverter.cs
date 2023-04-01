using Wowthing.Tool.Models.Achievements;

namespace Wowthing.Tool.Converters.Achievements;

public class OutCriteriaConverter : JsonConverter<OutCriteria>
{
    public override OutCriteria Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        throw new NotImplementedException();
    }

    public override void Write(Utf8JsonWriter writer, OutCriteria criteria, JsonSerializerOptions options)
    {
        writer.WriteStartArray();
        writer.WriteNumberValue(criteria.Id);
        writer.WriteNumberValue(criteria.Asset);
        writer.WriteNumberValue(criteria.ModifierTreeId);
        writer.WriteNumberValue(criteria.Type);
        writer.WriteEndArray();
    }
}
