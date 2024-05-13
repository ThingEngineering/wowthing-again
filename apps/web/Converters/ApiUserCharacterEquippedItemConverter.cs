using Wowthing.Web.Models.Api.User;

namespace Wowthing.Web.Converters;

public class ApiUserCharacterEquippedItemConverter : JsonConverter<ApiUserCharacterEquippedItem>
{
    public override ApiUserCharacterEquippedItem Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        throw new NotImplementedException();
    }

    public override void Write(Utf8JsonWriter writer, ApiUserCharacterEquippedItem item, JsonSerializerOptions options)
    {
        writer.WriteStartArray();

        writer.WriteNumberValue(item.Context);
        writer.WriteNumberValue(item.CraftedQuality);
        writer.WriteNumberValue(item.ItemId);
        writer.WriteNumberValue(item.ItemLevel);
        writer.WriteNumberValue((int)item.Quality);

        writer.WriteNumberArray(item.BonusIds);
        writer.WriteNumberArray(item.EnchantmentIds);
        writer.WriteNumberArray(item.GemIds);

        writer.WriteEndArray();
    }
}
