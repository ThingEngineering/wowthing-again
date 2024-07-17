using Wowthing.Tool.Models.Static;

namespace Wowthing.Tool.Converters.Static;

public class StaticWorldQuestConverter : JsonConverter<StaticWorldQuest>
{
    public override StaticWorldQuest Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        throw new NotImplementedException();
    }

    public override void Write(Utf8JsonWriter writer, StaticWorldQuest worldQuest, JsonSerializerOptions options)
    {
        writer.WriteStartArray();

        writer.WriteNumberValue(worldQuest.Id);
        writer.WriteNumberValue(worldQuest.Expansion);
        writer.WriteNumberValue(worldQuest.QuestInfoId);
        writer.WriteNumberValue((short)worldQuest.Faction);
        writer.WriteNumberValue(worldQuest.MinLevel);
        writer.WriteNumberValue(worldQuest.MaxLevel);
        writer.WriteStringValue(worldQuest.Name);

        if (worldQuest.SkipQuestIds.Count > 0 || worldQuest.NeedQuestIds.Count > 0)
        {
            writer.WriteNumberArray(worldQuest.NeedQuestIds);
        }

        if (worldQuest.SkipQuestIds.Count > 0)
        {
            writer.WriteNumberArray(worldQuest.SkipQuestIds);
        }

        writer.WriteEndArray();
    }
}
