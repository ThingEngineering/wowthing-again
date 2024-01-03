using System.Text.Json;
using System.Text.Json.Serialization;
using Wowthing.Lib.Models.Player;

namespace Wowthing.Lib.Converters;

public class
    PlayerCharacterMythicPlusRunMemberConverter : JsonConverter<PlayerCharacterMythicPlusRunMember>
{
    public override PlayerCharacterMythicPlusRunMember Read(ref Utf8JsonReader reader, Type typeToConvert,
        JsonSerializerOptions options)
    {
        throw new NotImplementedException();
    }

    public override void Write(Utf8JsonWriter writer, PlayerCharacterMythicPlusRunMember member,
        JsonSerializerOptions options)
    {
        writer.WriteStartArray();

        writer.WriteNumberValue(member.RealmId);
        writer.WriteStringValue(member.Name);
        writer.WriteNumberValue(member.SpecializationId);
        writer.WriteNumberValue(member.ItemLevel);

        writer.WriteEndArray();
    }
}
