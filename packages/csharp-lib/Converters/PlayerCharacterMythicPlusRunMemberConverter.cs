using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Wowthing.Lib.Models.Player;

namespace Wowthing.Lib.Converters;

public class PlayerCharacterMythicPlusRunMemberConverter : JsonConverter
{
    public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
    {
        var member = (PlayerCharacterMythicPlusRunMember) value;
        var arr = new JArray();
        arr.Add(member.RealmId);
        arr.Add(member.Name);
        arr.Add(member.SpecializationId);
        arr.Add(member.ItemLevel);
        arr.WriteTo(writer);
    }

    public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
    {
        throw new NotImplementedException();
    }

    public override bool CanConvert(Type objectType)
    {
        return typeof(PlayerCharacterMythicPlusRunMember) == objectType;
    }

    public override bool CanRead => false;
}