using Newtonsoft.Json.Linq;
using Wowthing.Backend.Models.Manual;
using Wowthing.Lib.Enums;

namespace Wowthing.Backend.Converters.Manual;

public class ManualVendorConverter : JsonConverter
{
    public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
    {
        var vendor = (ManualVendor) value;
        var vendorArray = new JArray();
        vendorArray.Add(vendor.Id);
        vendorArray.Add(vendor.Name);

        var tagsArray = new JArray();
        foreach (var tag in vendor.Tags.EmptyIfNull())
        {
            tagsArray.Add(tag);
        }
        vendorArray.Add(tagsArray);

        var locationsObject = new JObject();
        foreach (var (mapName, locations) in vendor.Locations)
        {
            locationsObject.Add(mapName, new JArray(
                locations.Select(loc => new JArray(loc.Split(' ')))
            ));
        }
        vendorArray.Add(locationsObject);

        var sellsArray = new JArray();
        foreach (var item in vendor.Sells)
        {
            var itemArray = new JArray();

            itemArray.Add(Enum.Parse<RewardType>(item.Type, true));
            itemArray.Add(item.Id);

            if (!string.IsNullOrWhiteSpace(item.Note))
            {
                itemArray.Add(item.Note);
            }

            sellsArray.Add(itemArray);
        }
        vendorArray.Add(sellsArray);

        if (!string.IsNullOrWhiteSpace(vendor.Note))
        {
            vendorArray.Add(vendor.Note);
        }

        vendorArray.WriteTo(writer);
    }

    public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
    {
        throw new NotImplementedException();
    }

    public override bool CanConvert(Type objectType)
    {
        return typeof(ManualVendor) == objectType;
    }

    public override bool CanRead => false;
}
