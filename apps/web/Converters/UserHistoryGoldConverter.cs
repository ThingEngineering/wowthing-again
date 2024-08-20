using Wowthing.Web.Models;

namespace Wowthing.Web.Converters;

public class UserHistoryGoldConverter : JsonConverter<UserHistoryGold>
{
    public override UserHistoryGold Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        throw new NotImplementedException();
    }

    public override void Write(Utf8JsonWriter writer, UserHistoryGold value, JsonSerializerOptions options)
    {
        writer.WriteStartArray();

        writer.WriteStringValue(value.Time.ToString("O"));

        writer.WriteStartArray();
        foreach (var entry in value.Entries)
        {
            writer.WriteStartArray();
            writer.WriteNumberValue(entry.AccountId);
            writer.WriteNumberValue(entry.RealmId);
            writer.WriteNumberValue(entry.Gold);
            writer.WriteEndArray();
        }
        writer.WriteEndArray();

        writer.WriteEndArray();
    }
}
