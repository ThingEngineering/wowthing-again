using Newtonsoft.Json.Linq;
using Wowthing.Backend.Models.Data.Achievements;

namespace Wowthing.Backend.Converters
{
    public class OutAchievementConverter : JsonConverter
    {
        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            var criteria = (OutAchievement) value;
            var arr = new JArray();
            arr.Add(criteria.Id);
            arr.Add(criteria.CategoryId);
            arr.Add(criteria.CriteriaTreeId);
            arr.Add(criteria.Faction);
            arr.Add((int)criteria.Flags);
            arr.Add(criteria.MinimumCriteria);
            arr.Add(criteria.Order);
            arr.Add(criteria.Points);
            arr.Add(criteria.SupersededBy);
            arr.Add(criteria.Supersedes);
            arr.Add(criteria.Description);
            arr.Add(criteria.Name);
            arr.Add(criteria.Reward);
            arr.WriteTo(writer);
        }

        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
            throw new NotImplementedException();
        }

        public override bool CanConvert(Type objectType)
        {
            return typeof(OutAchievement) == objectType;
        }

        public override bool CanRead => false;
    }
}
