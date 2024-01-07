using Wowthing.Lib.Models.Player;

namespace Wowthing.Web.Converters;

public class PlayerCharacterAddonDataMythicPlusMapConverter : JsonConverter<PlayerCharacterAddonDataMythicPlusMap>
{
    public override PlayerCharacterAddonDataMythicPlusMap Read(ref Utf8JsonReader reader, Type typeToConvert,
        JsonSerializerOptions options)
    {
        throw new NotImplementedException();
    }

    public override void Write(Utf8JsonWriter writer, PlayerCharacterAddonDataMythicPlusMap mapData, JsonSerializerOptions options)
    {
        writer.WriteStartArray();

        writer.WriteNumberValue(mapData.OverallScore);

        if (mapData.FortifiedScore != null || mapData.TyrannicalScore != null)
        {
            WriteScore(writer, mapData.FortifiedScore, options);
            WriteScore(writer, mapData.TyrannicalScore, options);
        }

        writer.WriteEndArray();
    }

    private void WriteScore(Utf8JsonWriter writer, PlayerCharacterAddonDataMythicPlusScore scoreData, JsonSerializerOptions options)
    {
        if (scoreData == null)
        {
            writer.WriteNullValue();
        }
        else
        {
            writer.WriteStartArray();
            writer.WriteNumberValue(scoreData.Level);
            writer.WriteNumberValue(scoreData.Score);
            writer.WriteNumberValue(scoreData.DurationSec);
            writer.WriteNumberValue(scoreData.OverTime ? 1 : 0);
            writer.WriteEndArray();
        }
    }
}
