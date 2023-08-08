using System.Text.Json;
using Wowthing.Lib.Models.Wow;

namespace Wowthing.Lib.Converters;

public class WowItemBonusConverter : System.Text.Json.Serialization.JsonConverter<WowItemBonus>
{
    public override WowItemBonus Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        throw new NotImplementedException();
    }

    public override void Write(Utf8JsonWriter writer, WowItemBonus itemBonus, JsonSerializerOptions options)
    {
        writer.WriteStartArray();

        writer.WriteNumberValue(itemBonus.Id);
        writer.WriteNumberValue(itemBonus.BonusTypeFlags);

        writer.WriteStartArray();
        foreach (var bonusList in itemBonus.Bonuses)
        {
            writer.WriteNumberArray(bonusList);
        }
        writer.WriteEndArray();

        writer.WriteEndArray();
    }
}
