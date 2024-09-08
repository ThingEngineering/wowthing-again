using Wowthing.Tool.Models.Static;

namespace Wowthing.Tool.Converters.Static;

public class StaticCampaignConverter : JsonConverter<StaticCampaign>
{
    public override StaticCampaign? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        throw new NotImplementedException();
    }

    public override void Write(Utf8JsonWriter writer, StaticCampaign campaign, JsonSerializerOptions options)
    {
        writer.WriteStartArray();

        writer.WriteNumberValue(campaign.Id);
        writer.WriteNumberArray(campaign.QuestLineIds);

        writer.WriteEndArray();
    }
}
