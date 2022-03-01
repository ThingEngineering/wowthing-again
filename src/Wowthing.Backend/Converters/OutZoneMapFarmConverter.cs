using Newtonsoft.Json.Linq;
using Wowthing.Backend.Models.Data.ZoneMaps;
using Wowthing.Lib.Enums;

namespace Wowthing.Backend.Converters
{
    public class OutZoneMapFarmConverter : JsonConverter
    {
        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            var farm = (OutZoneMapFarm) value;
            var arr = new JArray();

            arr.Add(farm.Type);
            arr.Add(farm.Reset);
            arr.Add(farm.IdType);
            arr.Add(farm.Id);
            arr.Add(farm.Name);
            arr.Add(string.Join(",", farm.Location));
            arr.Add(new JArray(farm.QuestIds));
            
            var dropsArray = new JArray();
            foreach (var drop in farm.Drops.EmptyIfNull())
            {
                dropsArray.Add(CreateDropArray(drop));
            }
            arr.Add(dropsArray);

            var useMinimumLevel = farm.MinimumLevel > 0;
            var useRequiredQuestIds = farm.RequiredQuestIds.Count > 0;
            var useNote = !string.IsNullOrEmpty(farm.Note);
            var useFaction = !string.IsNullOrEmpty(farm.Faction);

            if (useFaction || useNote || useRequiredQuestIds || useMinimumLevel)
            {
                arr.Add(farm.MinimumLevel ?? 0);
            }

            if (useFaction || useNote || useRequiredQuestIds)
            {
                arr.Add(new JArray(farm.RequiredQuestIds));
            }

            if (useFaction || useNote)
            {
                arr.Add(farm.Note ?? "");
            }

            if (useFaction)
            {
                arr.Add(farm.Faction);
            }

            arr.WriteTo(writer);
        }

        private JArray CreateDropArray(OutZoneMapDrop drop)
        {
            var dropArray = new JArray();

            var dropType = Enum.Parse<FarmDropType>(drop.Type, true);
            
            dropArray.Add(drop.Id);
            dropArray.Add(drop.Name);
            dropArray.Add(dropType);
            dropArray.Add(drop.SubType);
            dropArray.Add(drop.ClassMask);
            
            // Optional things
            var limit = drop.Limit.EmptyIfNull();
            var questIds = drop.QuestIds.EmptyIfNull();
            var requiredQuestId = drop.RequiredQuestId ?? 0;

            var useLimit = limit.Length > 0;
            var useQuestIds = questIds.Length > 0;
            var useRequiredQuestId = requiredQuestId > 0;
            var useNote = !string.IsNullOrEmpty(drop.Note);

            if (useNote || useRequiredQuestId || useQuestIds || useLimit)
            {
                dropArray.Add(JArray.FromObject(limit));
            }

            if (useNote || useRequiredQuestId || useQuestIds)
            {
                dropArray.Add(JArray.FromObject(questIds));
            }

            if (useNote || useRequiredQuestId)
            {
                dropArray.Add(requiredQuestId);
            }

            if (useNote)
            {
                dropArray.Add(drop.Note);
            }

            return dropArray;
        }
        
        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
            throw new NotImplementedException();
        }

        public override bool CanConvert(Type objectType)
        {
            return typeof(OutZoneMapFarm) == objectType;
        }

        public override bool CanRead => false;
        
    }
}