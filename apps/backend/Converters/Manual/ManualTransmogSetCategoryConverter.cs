using Newtonsoft.Json.Linq;
using Wowthing.Backend.Models.Data.TransmogSets;
using Wowthing.Backend.Models.Manual.TransmogSets;

namespace Wowthing.Backend.Converters.Manual;

public class ManualTransmogSetCategoryConverter : JsonConverter
{
        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
    {
        var category = (ManualTransmogSetCategory)value;

        var catArray = new JArray();
        catArray.Add(category.Name);
        catArray.Add(category.Slug);

        var groupsArray = new JArray();
        foreach (var group in category.Groups.EmptyIfNull())
        {
            groupsArray.Add(CreateGroupArray(group));
        }
        catArray.Add(groupsArray);

        var setsArray = new JArray();
        foreach (var set in category.Sets.EmptyIfNull())
        {
            setsArray.Add(CreateSetArray(set));
        }
        catArray.Add(setsArray);

        catArray.WriteTo(writer);
    }

    private JToken CreateGroupArray(ManualTransmogSetGroup group)
    {
        var groupArray = new JArray();
        groupArray.Add(group.Type);
        groupArray.Add(group.Name);

        var tagsArray = new JArray();
        foreach (var tag in group.MatchTags.EmptyIfNull())
        {
            tagsArray.Add(tag);
        }
        groupArray.Add(tagsArray);

        bool usePrefix = !string.IsNullOrWhiteSpace(group.Prefix);
        bool useCompletionist = group.Completionist.HasValue;

        if (usePrefix || useCompletionist)
        {
            groupArray.Add(group.Prefix);
        }

        if (useCompletionist)
        {
            groupArray.Add(group.Completionist.Value);
        }

        return groupArray;
    }

    private JArray CreateSetArray(ManualTransmogSetSet set)
    {
        var setArray = new JArray();
        setArray.Add(set.Name);

        var tagsArray = new JArray();
        foreach (var tag in set.MatchTags.EmptyIfNull())
        {
            tagsArray.Add(tag);
        }
        setArray.Add(tagsArray);

        if (set.Completionist.HasValue)
        {
            setArray.Add(set.Completionist.Value);
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
        return typeof(DataTransmogSetCategory) == objectType;
    }

    public override bool CanRead => false;
}
