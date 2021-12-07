using System;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Wowthing.Backend.Models.Data.Journal;

namespace Wowthing.Backend.Converters
{
    public class OutJournalEncounterItemConverter : JsonConverter
    {
        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            var item = (OutJournalEncounterItem) value;
            
            var arr = new JArray();
            arr.Add(item.Id);
            arr.Add(item.Quality);
            arr.Add(item.ClassId);
            arr.Add(item.SubclassId);
            arr.Add(item.ClassMask);

            var appearancesArray = new JArray();
            foreach (var appearance in item.Appearances)
            {
                var appearanceArray = new JArray();
                appearanceArray.Add(appearance.AppearanceId);
                appearanceArray.Add(appearance.ModifierId);
                appearanceArray.Add(new JArray(appearance.Difficulties));
                
                appearancesArray.Add(appearanceArray);
            }
            
            arr.Add(appearancesArray);
            arr.WriteTo(writer);
        }

        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
            throw new NotImplementedException();
        }

        public override bool CanConvert(Type objectType)
        {
            return typeof(OutJournalEncounterItem) == objectType;
        }

        public override bool CanRead => false;
    }
}
