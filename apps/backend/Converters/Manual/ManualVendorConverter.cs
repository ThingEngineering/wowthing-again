using MoreLinq.Extensions;
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
            sellsArray.Add(CreateItemArray(item));
        }
        vendorArray.Add(sellsArray);

        if (!string.IsNullOrWhiteSpace(vendor.Note))
        {
            vendorArray.Add(vendor.Note);
        }

        vendorArray.WriteTo(writer);
    }

    private JArray CreateItemArray(ManualVendorItem item)
    {
        bool useCosts = item.Costs.EmptyIfNull().Count >= 0;
        bool useReputation = !string.IsNullOrWhiteSpace(item.Reputation);
        bool useNote = !string.IsNullOrWhiteSpace(item.Note);

        var itemArray = new JArray();

        itemArray.Add(Enum.Parse<RewardType>(item.Type, true));
        itemArray.Add(item.Id);

        if (useNote || useReputation || useCosts)
        {
            var costsArray = new JArray();
            foreach (var (currency, amount) in item.Costs.EmptyIfNull().OrderBy(kvp => kvp.Key))
            {
                var costArray = new JArray();
                costArray.Add(currency);
                costArray.Add(amount);
                costsArray.Add(costArray);
            }

            itemArray.Add(costsArray);
        }

        if (useNote || useReputation)
        {
            var reputationArray = new JArray();
            if (!string.IsNullOrWhiteSpace(item.Reputation))
            {
                var parts = item.Reputation.Split();
                reputationArray.Add(int.Parse(parts[0]));
                reputationArray.Add(Enum.Parse<RewardReputation>(parts[1], true));
            }
            itemArray.Add(reputationArray);
        }

        if (useNote)
        {
            itemArray.Add(item.Note);
        }

        return itemArray;
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
