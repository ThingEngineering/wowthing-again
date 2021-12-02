using System;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Wowthing.Backend.Models.Data.ZoneMaps;
using Wowthing.Lib.Enums;
using Wowthing.Lib.Extensions;

namespace Wowthing.Backend.Converters
{
    public class OutZoneMapDropConverter : JsonConverter
    {
        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            var drop = (OutZoneMapDrop) value;
            var arr = new JArray();
            
            var limit = drop.Limit.EmptyIfNull();
            var questIds = drop.QuestIds.EmptyIfNull();
            var requiredQuestId = drop.RequiredQuestId ?? 0;
            
            var useLimit = limit.Length > 0;
            var useQuestIds = questIds.Length > 0;
            var useRequiredQuestId = requiredQuestId > 0;
            var useNote = !string.IsNullOrEmpty(drop.Note);

            arr.Add(drop.Id);
            arr.Add(Enum.Parse<FarmDropType>(drop.Type, true));
            arr.Add(drop.Name);

            if (useNote || useRequiredQuestId || useQuestIds || useLimit)
            {
                arr.Add(new JArray(limit));
            }

            if (useNote || useRequiredQuestId || useQuestIds)
            {
                arr.Add(new JArray(questIds));
            }

            if (useNote || useRequiredQuestId)
            {
                arr.Add(requiredQuestId);
            }

            if (useNote)
            {
                arr.Add(drop.Note);
            }
            arr.WriteTo(writer);
        }
        
        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
            throw new NotImplementedException();
        }

        public override bool CanConvert(Type objectType)
        {
            return typeof(OutZoneMapDrop) == objectType;
        }

        public override bool CanRead => false;
   }
}
