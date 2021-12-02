using System;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Wowthing.Backend.Models.Data;

namespace Wowthing.Backend.Converters
{
    public class OutReputationConverter : JsonConverter
    {
        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            var instance = (OutReputation) value;
            var arr = new JArray();
            arr.Add(instance.Id);
            arr.Add(instance.TierId);
            arr.Add(instance.Name);
            arr.WriteTo(writer);
        }

        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
            throw new NotImplementedException();
        }

        public override bool CanConvert(Type objectType)
        {
            return typeof(OutReputation) == objectType;
        }

        public override bool CanRead => false;
    }
}
