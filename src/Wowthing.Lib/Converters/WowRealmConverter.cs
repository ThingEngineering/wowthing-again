using System;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Wowthing.Lib.Models.Wow;

namespace Wowthing.Lib.Converters
{
    public class WowRealmConverter : JsonConverter
    {
        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            var member = (WowRealm)value;
            var arr = new JArray();
            arr.Add(member.Id);
            arr.Add(member.Region);
            arr.Add(member.ConnectedRealmId);
            arr.Add(member.Name);
            arr.Add(member.Slug);
            arr.WriteTo(writer);
        }

        public override object ReadJson(JsonReader reader, Type objectType, object existingValue,
            JsonSerializer serializer)
        {
            throw new NotImplementedException();
        }

        public override bool CanConvert(Type objectType)
        {
            return typeof(WowRealm) == objectType;
        }

        public override bool CanRead => false;
    }
}
