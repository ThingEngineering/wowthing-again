using Wowthing.Lib.Models.Player;

namespace Wowthing.Lib.Converters;

public class PlayerGuildItemConverter : JsonConverter<PlayerGuildItem>
{
    public override PlayerGuildItem Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        throw new NotImplementedException();
    }

    public override void Write(Utf8JsonWriter writer, PlayerGuildItem item, JsonSerializerOptions options)
    {
        writer.WriteStartArray();

        JsonSerializer.Serialize(writer, item as BasePlayerItem, options);

        writer.WriteEndArray();
    }
}
