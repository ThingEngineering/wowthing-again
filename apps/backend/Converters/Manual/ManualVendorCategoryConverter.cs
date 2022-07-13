using Newtonsoft.Json.Linq;
using Wowthing.Backend.Models.Manual.Vendors;

namespace Wowthing.Backend.Converters.Manual;

public class ManualVendorCategoryConverter : JsonConverter
{
    public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
    {
        var category = (ManualVendorCategory)value;
        var catArray = new JArray();

        catArray.Add(category.Name);
        catArray.Add(category.Slug);

        var groupsArray = new JArray();
        foreach (var group in category.Groups)
        {
            groupsArray.Add(CreateGroupArray(group));
        }
        catArray.Add(groupsArray);

        var mapsArray = new JArray();
        foreach (var mapName in category.VendorMaps)
        {
            mapsArray.Add(mapName);
        }
        catArray.Add(mapsArray);

        var tagsArray = new JArray();
        foreach (var mapName in category.VendorTags)
        {
            tagsArray.Add(mapName);
        }
        catArray.Add(tagsArray);

        catArray.WriteTo(writer);
    }

    private JArray CreateGroupArray(ManualVendorGroup group)
    {
        var groupArray = new JArray();

        groupArray.Add(group.Name);
        groupArray.Add(group.Type);

        var itemsArray = new JArray();
        foreach (var item in group.Things)
        {
            itemsArray.Add(CreateItemArray(item));
        }
        groupArray.Add(itemsArray);

        return groupArray;
    }

    private JToken CreateItemArray(ManualVendorItem item)
    {
        var itemArray = new JArray();

        itemArray.Add(item.Id);
        itemArray.Add(item.Quality);
        itemArray.Add(item.ClassMask);

        var costsArray = new JArray();
        foreach (var (currency, amount) in item.Costs)
        {
            var costArray = new JArray();
            costArray.Add(currency);
            costArray.Add(amount);
            costsArray.Add(costArray);
        }
        itemArray.Add(costsArray);

        if (item.AppearanceId.HasValue)
        {
            itemArray.Add(item.AppearanceId.Value);
        }

        return itemArray;
    }

    public override object ReadJson(JsonReader reader, Type objectType, object existingValue,
        JsonSerializer serializer)
    {
        throw new NotImplementedException();
    }

    public override bool CanConvert(Type objectType)
    {
        return typeof(ManualVendorCategory) == objectType;
    }

    public override bool CanRead => false;
}
