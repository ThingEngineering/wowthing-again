using Newtonsoft.Json.Linq;
using Wowthing.Backend.Models.Data.Transmog;
using Wowthing.Backend.Models.Manual.Transmog;

namespace Wowthing.Backend.Converters.Manual
{
    public class ManualTransmogCategoryConverter : JsonConverter
    {
        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            var category = (ManualTransmogCategory)value;

            var catArray = new JArray();
            catArray.Add(category.Name);
            catArray.Add(category.Slug);

            var groupsArray = new JArray();
            foreach (var group in category.Groups)
            {
                groupsArray.Add(CreateGroupArray(group));
            }

            catArray.Add(groupsArray);

            catArray.WriteTo(writer);
        }

        private JToken CreateGroupArray(ManualTransmogGroup group)
        {
            var groupArray = new JArray();
            groupArray.Add(group.Name);
            groupArray.Add(group.Type);

            var setsArray = new JArray();
            foreach (var set in group.Sets)
            {
                setsArray.Add(set);
            }

            groupArray.Add(setsArray);

            var datasArray = new JArray();
            foreach (var (key, sets) in group.Data)
            {
                var dataArray = new JArray();
                dataArray.Add(key);

                var dataSetsArray = new JArray();
                foreach (var set in sets)
                {
                    dataSetsArray.Add(CreateSetArray(set));
                }
                dataArray.Add(dataSetsArray);

                datasArray.Add(dataArray);
            }
            groupArray.Add(datasArray);

            if (!string.IsNullOrWhiteSpace(group.Tag))
            {
                groupArray.Add(group.Tag);
            }

            return groupArray;
        }

        private JArray CreateSetArray(ManualTransmogSet set)
        {
            var setArray = new JArray();
            setArray.Add(set.Name);

            var itemsObject = new JObject();
            foreach (var (key, items) in set.Items)
            {
                var itemArray = new JArray();
                foreach (var itemId in items)
                {
                    itemArray.Add(itemId);
                }

                itemsObject[key] = itemArray;
            }
            setArray.Add(itemsObject);

            if (set.WowheadSetId > 0)
            {
                setArray.Add(set.WowheadSetId);
            }

            return setArray;
        }

        public override object ReadJson(JsonReader reader, Type objectType, object existingValue,
            JsonSerializer serializer)
        {
            throw new NotImplementedException();
        }

        public override bool CanConvert(Type objectType)
        {
            return typeof(ManualTransmogCategory) == objectType;
        }

        public override bool CanRead => false;
    }
}
