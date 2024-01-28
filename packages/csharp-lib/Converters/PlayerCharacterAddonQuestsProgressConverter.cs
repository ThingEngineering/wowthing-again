using Wowthing.Lib.Models.Player;

namespace Wowthing.Lib.Converters;

public class PlayerCharacterAddonQuestsProgressConverter : JsonConverter<PlayerCharacterAddonQuestsProgress>
{
    public override PlayerCharacterAddonQuestsProgress Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        throw new NotImplementedException();
    }

    public override void Write(Utf8JsonWriter writer, PlayerCharacterAddonQuestsProgress progressQuest, JsonSerializerOptions options)
    {
        writer.WriteStartArray();

        writer.WriteNumberValue(progressQuest.Id);
        writer.WriteNumberValue(progressQuest.Status);
        writer.WriteNumberValue(progressQuest.Expires);
        writer.WriteStringValue(progressQuest.Name);

        writer.WriteStartArray();
        foreach (var objective in progressQuest.Objectives.EmptyIfNull())
        {
            writer.WriteStartArray();
            writer.WriteStringValue(objective.Type);
            writer.WriteNumberValue(objective.Have);
            writer.WriteNumberValue(objective.Need);
            writer.WriteStringValue(objective.Text);
            writer.WriteEndArray();
        }
        writer.WriteEndArray();

        writer.WriteEndArray();
    }
}
