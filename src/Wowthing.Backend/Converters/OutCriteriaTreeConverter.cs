using Newtonsoft.Json.Linq;
using Wowthing.Backend.Models.Data.Achievements;

namespace Wowthing.Backend.Converters
{
    public class OutCriteriaTreeConverter: JsonConverter
    {
        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            var criteriaTree = (OutCriteriaTree) value;
            
            var arr = new JArray();
            arr.Add(criteriaTree.Id);
            arr.Add(criteriaTree.Amount);
            arr.Add(criteriaTree.CriteriaId);
            arr.Add(criteriaTree.Flags);
            arr.Add(criteriaTree.Operator);
            arr.Add(criteriaTree.Description);
            arr.Add(new JArray { criteriaTree.Children });
            
            arr.WriteTo(writer);
        }

        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
            throw new NotImplementedException();
        }

        public override bool CanConvert(Type objectType)
        {
            return typeof(OutCriteriaTree) == objectType;
        }

        public override bool CanRead => false;
    }
}
