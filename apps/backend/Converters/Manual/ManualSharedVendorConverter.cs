using Newtonsoft.Json.Linq;
using Wowthing.Backend.Models.Manual.Vendors;
using Wowthing.Lib.Enums;

namespace Wowthing.Backend.Converters.Manual;

public class ManualSharedVendorConverter : JsonConverter
{
    private static readonly int[] EmptyAppearances = { 0 };

    public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
    {
        var vendor = (ManualSharedVendor) value;
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

        var setsArray = new JArray();
        foreach (var set in vendor.Sets)
        {
            setsArray.Add(CreateSetArray(set));
        }
        vendorArray.Add(setsArray);

        bool useNote = !string.IsNullOrWhiteSpace(vendor.Note);
        bool useGroupId = vendor.ZoneMapsGroupId != null;

        if (useGroupId || useNote)
        {
            vendorArray.Add(vendor.Note);
        }

        if (useGroupId)
        {
            vendorArray.Add(vendor.ZoneMapsGroupId.Value);
        }

        vendorArray.WriteTo(writer);
    }

    public static JArray CreateSetArray(ManualSharedVendorSet set)
    {
        var setArray = new JArray();
        setArray.Add(set.Name);

        var rangeArray = new JArray();
        rangeArray.Add(set.Range[0]);
        rangeArray.Add(set.Range[1]);
        setArray.Add(rangeArray);

        if (set.SkipTooltip || !string.IsNullOrWhiteSpace(set.SortKey))
        {
            setArray.Add(set.SortKey);
        }

        if (set.SkipTooltip)
        {
            setArray.Add(set.SkipTooltip);
        }

        return setArray;
    }

    public static JArray CreateItemArray(ManualVendorItem item)
    {
        bool useCosts = item.Costs.EmptyIfNull().Count >= 0;
        bool useReputation = !string.IsNullOrWhiteSpace(item.Reputation);
        bool useAppearance = item.AppearanceIds != null;
        bool useNote = !string.IsNullOrWhiteSpace(item.Note);
        bool useBonusIds = item.BonusIds?.Length > 0;

        var itemArray = new JArray();

        itemArray.Add(item.Id);
        itemArray.Add(item.Type);
        itemArray.Add(item.SubType);
        itemArray.Add(item.Quality);
        itemArray.Add(item.ClassMask);

        if (useNote || useBonusIds || useAppearance || useReputation || useCosts)
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

        if (useNote || useBonusIds || useAppearance || useReputation)
        {
            var reputationArray = new JArray();
            if (!string.IsNullOrWhiteSpace(item.Reputation))
            {
                var parts = item.Reputation.Split();
                reputationArray.Add(int.Parse(parts[0]));

                var repLevel = string.Join(
                    "",
                    parts[1].Split('-')
                        .Select(part => part[0].ToString().ToUpper() + part.Substring(1))
                );
                reputationArray.Add(Enum.Parse<RewardReputation>(repLevel));
            }
            itemArray.Add(reputationArray);
        }

        if (useNote || useBonusIds || useAppearance)
        {
            var appearanceArray = new JArray();
            foreach (var appearanceId in item.AppearanceIds ?? EmptyAppearances)
            {
                appearanceArray.Add(appearanceId);
            }
            itemArray.Add(appearanceArray);
        }

        if (useNote || useBonusIds)
        {
            var bonusArray = new JArray();
            foreach (int bonusId in item.BonusIds.EmptyIfNull())
            {
                bonusArray.Add(bonusId);
            }
            itemArray.Add(bonusArray);
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
        return typeof(ManualSharedVendor) == objectType;
    }

    public override bool CanRead => false;
}
