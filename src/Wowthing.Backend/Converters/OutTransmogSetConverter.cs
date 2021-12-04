using System;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Wowthing.Backend.Models.Data.Transmog;

namespace Wowthing.Backend.Converters
{
    public class OutTransmogSetConverter : JsonConverter
    {
        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            var instance = (OutTransmogSet) value;
            var arr = new JArray();
            arr.Add(instance.WowheadSetId);
            arr.Add(instance.Name);

            var itemArr = new JArray();
            foreach (var (slot, items) in instance.Items)
            {
                var slotArr = new JArray();
                slotArr.Add(int.Parse(slot));
                foreach (var itemId in items)
                {
                    slotArr.Add(itemId);
                }
                itemArr.Add(slotArr);
            }
            arr.Add(itemArr);
            
            arr.WriteTo(writer);
        }

        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
            throw new NotImplementedException();
        }

        public override bool CanConvert(Type objectType)
        {
            return typeof(OutTransmogSet) == objectType;
        }

        public override bool CanRead => false;
    }
}
