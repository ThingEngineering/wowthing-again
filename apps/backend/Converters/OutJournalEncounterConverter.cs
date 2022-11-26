using Newtonsoft.Json.Linq;
using Wowthing.Backend.Models.Data.Journal;

namespace Wowthing.Backend.Converters;

public class OutJournalEncounterConverter : JsonConverter
{
    public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
    {
        var encounter = (OutJournalEncounter) value;

        var encounterArray = new JArray();
        encounterArray.Add(encounter.Id);
        encounterArray.Add(encounter.Name);

        var groupsArray = new JArray();
        foreach (var group in encounter.Groups)
        {
            var groupArray = new JArray();
            groupArray.Add(group.Name);

            var itemsArray = new JArray();
            foreach (var item in group.Items)
            {
                var itemArray = new JArray();
                itemArray.Add(item.Type);
                itemArray.Add(item.Id);
                itemArray.Add(item.Quality);
                itemArray.Add(item.ClassId);
                itemArray.Add(item.SubclassId);
                itemArray.Add(item.ClassMask);

                var appearancesArray = new JArray();
                foreach (var appearance in item.Appearances)
                {
                    var appearanceArray = new JArray();
                    appearanceArray.Add(appearance.AppearanceId);
                    appearanceArray.Add(appearance.ModifierId);
                    appearanceArray.Add(new JArray(appearance.Difficulties));

                    appearancesArray.Add(appearanceArray);
                }

                itemArray.Add(appearancesArray);
                itemsArray.Add(itemArray);
            }

            groupArray.Add(itemsArray);
            groupsArray.Add(groupArray);
        }
        encounterArray.Add(groupsArray);

        if (encounter.Statistics != null)
        {
            var statsArray = new JArray();
            foreach (var (difficulty, statisticIds) in encounter.Statistics)
            {
                var diffArray = new JArray();
                diffArray.Add(difficulty);

                var statisticsArray = new JArray();
                foreach (int statisticId in statisticIds)
                {
                    statisticsArray.Add(statisticId);
                }
                diffArray.Add(statisticsArray);

                statsArray.Add(diffArray);
            }
            encounterArray.Add(statsArray);
        }

        encounterArray.WriteTo(writer);
    }

    public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
    {
        throw new NotImplementedException();
    }

    public override bool CanConvert(Type objectType)
    {
        return typeof(OutJournalEncounter) == objectType;
    }

    public override bool CanRead => false;
}
