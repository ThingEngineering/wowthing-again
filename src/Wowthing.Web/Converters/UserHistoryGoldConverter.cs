using System;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Wowthing.Web.Models;

namespace Wowthing.Web.Converters
{
    public class UserHistoryGoldConverter : JsonConverter
    {
        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            var uhg = (UserHistoryGold) value;
            var arr = new JArray();
            arr.Add(uhg.Time);

            var entriesArr = new JArray();
            foreach (var entry in uhg.Entries)
            {
                var entryArr = new JArray();
                entryArr.Add(entry.AccountId);
                entryArr.Add(entry.RealmId);
                entryArr.Add(entry.Gold);
                entriesArr.Add(entryArr);
            }
            arr.Add(entriesArr);

            arr.WriteTo(writer);
        }

        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
            throw new NotImplementedException();
        }

        public override bool CanConvert(Type objectType)
        {
            return typeof(UserHistoryGold) == objectType;
        }

        public override bool CanRead => false;

    }
}
