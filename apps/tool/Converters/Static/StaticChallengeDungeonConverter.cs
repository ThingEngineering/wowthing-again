using Wowthing.Tool.Models.Static;

namespace Wowthing.Tool.Converters.Static;

public class StaticChallengeDungeonConverter : JsonConverter<StaticChallengeDungeon>
{
    public override StaticChallengeDungeon? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        throw new NotImplementedException();
    }

    public override void Write(Utf8JsonWriter writer, StaticChallengeDungeon dungeon, JsonSerializerOptions options)
    {
        writer.WriteStartArray();
        writer.WriteNumberValue(dungeon.Id);
        writer.WriteNumberValue(dungeon.Expansion);
        writer.WriteNumberValue(dungeon.MapId);
        writer.WriteStringValue(dungeon.Name);
        writer.WriteNumberArray(dungeon.TimerBreakpoints);
        writer.WriteEndArray();
    }
}
