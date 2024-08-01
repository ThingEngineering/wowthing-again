using Wowthing.Lib.Models.Player;

namespace Wowthing.Lib.Converters;

public class PlayerWarbankItemConverter : JsonConverter<PlayerWarbankItem>
{
    public override PlayerWarbankItem Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        throw new NotImplementedException();
    }

    public override void Write(Utf8JsonWriter writer, PlayerWarbankItem item, JsonSerializerOptions options)
    {
        writer.WriteStartArray();

        writer.WriteNumberValue((int)item.Region);

        JsonSerializer.Serialize(writer, item as BasePlayerItem, options);

        writer.WriteEndArray();
    }
}
