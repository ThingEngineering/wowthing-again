using Wowthing.Tool.Models.Items;

namespace Wowthing.Tool.Converters.Items;

public class RedisItemSetConverter : JsonConverter<RedisItemSet>
{
    public override RedisItemSet? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        throw new NotImplementedException();
    }

    public override void Write(Utf8JsonWriter writer, RedisItemSet set, JsonSerializerOptions options)
    {
        writer.WriteStartArray();
        writer.WriteNumberValue(set.Id);
        writer.WriteStringValue(set.Name);
        writer.WriteNumberArray(set.ItemIds);
        writer.WriteEndArray();
    }
}
