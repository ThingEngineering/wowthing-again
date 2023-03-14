// using Newtonsoft.Json.Linq;
//
// namespace Wowthing.Tool.Converters;
//
// public class OutCriteriaConverter : JsonConverter
// {
//     public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
//     {
//         var criteria = (OutCriteria) value;
//         var arr = new JArray();
//         arr.Add(criteria.Id);
//         arr.Add(criteria.Asset);
//         arr.Add(criteria.ModifierTreeId);
//         arr.Add(criteria.Type);
//         arr.WriteTo(writer);
//     }
//
//     public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
//     {
//         throw new NotImplementedException();
//     }
//
//     public override bool CanConvert(Type objectType)
//     {
//         return typeof(OutCriteria) == objectType;
//     }
//
//     public override bool CanRead => false;
// }
