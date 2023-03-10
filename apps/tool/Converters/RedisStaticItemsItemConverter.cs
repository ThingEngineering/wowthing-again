using Newtonsoft.Json.Linq;

namespace Wowthing.Tool.Converters;

public class RedisStaticItemsItemConverter : JsonConverter
{
    public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
    {
        var item = (RedisStaticItemsItem) value;
        var arr = new JArray();

        arr.Add(item.Id);
        arr.Add(item.GetCalculatedClassMask());
        arr.Add(item.RaceMask);
        arr.Add(item.Stackable);
        arr.Add(item.ClassId);
        arr.Add(item.SubclassId);
        arr.Add(item.InventoryType);
        arr.Add(item.ContainerSlots);
        arr.Add(item.Quality);
        arr.Add(item.PrimaryStat);
        arr.Add(item.Flags);
        arr.Add(item.Expansion);
        arr.Add(item.ItemLevel);
        arr.Add(item.RequiredLevel);
        arr.Add(item.Name);

        if (item.Appearances.Length > 0)
        {
            var appearancesArray = new JArray();
            foreach (var appearance in item.Appearances.OrderBy(ima => ima.Order))
            {
                var appearanceArray = new JArray();
                appearanceArray.Add(appearance.Modifier);
                appearanceArray.Add(appearance.AppearanceId);
                appearanceArray.Add(appearance.SourceType);
                appearancesArray.Add(appearanceArray);
            }

            arr.Add(appearancesArray);
        }

        arr.WriteTo(writer);
    }

    public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
    {
        throw new NotImplementedException();
    }

    public override bool CanConvert(Type objectType)
    {
        return typeof(RedisStaticItemsItem) == objectType;
    }

    public override bool CanRead => false;
}
