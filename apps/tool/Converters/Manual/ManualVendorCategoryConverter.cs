// using Newtonsoft.Json.Linq;
//
// namespace Wowthing.Tool.Converters.Manual;
//
// public class ManualVendorCategoryConverter : JsonConverter
// {
//     public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
//     {
//         var category = (ManualVendorCategory)value;
//         var catArray = new JArray();
//
//         catArray.Add(category.Name);
//         catArray.Add(category.Slug);
//
//         var groupsArray = new JArray();
//         foreach (var group in category.Groups)
//         {
//             groupsArray.Add(CreateGroupArray(group));
//         }
//         catArray.Add(groupsArray);
//
//         var mapsArray = new JArray();
//         foreach (var mapName in category.VendorMaps)
//         {
//             mapsArray.Add(mapName);
//         }
//         catArray.Add(mapsArray);
//
//         var tagsArray = new JArray();
//         foreach (var mapName in category.VendorTags)
//         {
//             tagsArray.Add(mapName);
//         }
//         catArray.Add(tagsArray);
//
//         catArray.WriteTo(writer);
//     }
//
//     private JArray CreateGroupArray(ManualVendorGroup group)
//     {
//         var groupArray = new JArray();
//
//         groupArray.Add(group.Name);
//
//         var itemsArray = new JArray();
//         foreach (var item in group.Things)
//         {
//             itemsArray.Add(ManualSharedVendorConverter.CreateItemArray(item));
//         }
//         groupArray.Add(itemsArray);
//
//         return groupArray;
//     }
//
//     public override object ReadJson(JsonReader reader, Type objectType, object existingValue,
//         JsonSerializer serializer)
//     {
//         throw new NotImplementedException();
//     }
//
//     public override bool CanConvert(Type objectType)
//     {
//         return typeof(ManualVendorCategory) == objectType;
//     }
//
//     public override bool CanRead => false;
// }
