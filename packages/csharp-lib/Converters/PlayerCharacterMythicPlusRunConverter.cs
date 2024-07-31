using Wowthing.Lib.Models.Player;

namespace Wowthing.Lib.Converters;

public class PlayerCharacterMythicPlusRunConverter : JsonConverter<PlayerCharacterMythicPlusRun>
{
    public override PlayerCharacterMythicPlusRun Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        throw new NotImplementedException();
    }

    public override void Write(Utf8JsonWriter writer, PlayerCharacterMythicPlusRun run, JsonSerializerOptions options)
    {
        writer.WriteStartArray();

        JsonSerializer.Serialize(writer, run.Completed, options);

        writer.WriteNumberValue(run.DungeonId);
        writer.WriteNumberValue(run.KeystoneLevel);
        writer.WriteNumberValue(run.Duration);
        writer.WriteNumberValue(run.Timed ? 1 : 0);

        writer.WriteNumberArray(run.Affixes);

        writer.WriteEndArray();
    }
}
