using Newtonsoft.Json.Linq;
using Wowthing.Backend.Models.Manual.ZoneMaps;
using Wowthing.Lib.Enums;

namespace Wowthing.Backend.Converters.Manual;

public class ManualZoneMapCategoryConverter : JsonConverter
{
    public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
    {
        var category = (ManualZoneMapCategory)value;
        var catArray = new JArray();

        catArray.Add(category.Name);
        catArray.Add(category.Slug);
        catArray.Add(category.MapName);
        catArray.Add(category.MinimumLevel);

        var questArray = new JArray();
        foreach (var questId in category.RequiredQuestIds)
        {
            questArray.Add(questId);
        }
        catArray.Add(questArray);

        var farmArray = new JArray();
        foreach (var farm in category.Farms)
        {
            farmArray.Add(CreateFarmArray(farm));
        }
        catArray.Add(farmArray);

        if (!string.IsNullOrWhiteSpace(category.WowheadGuide))
        {
            catArray.Add(category.WowheadGuide);
        }

        catArray.WriteTo(writer);
    }

    private JArray CreateFarmArray(ManualZoneMapFarm farm)
    {
        var farmArray = new JArray();

        farmArray.Add(farm.Type);
        farmArray.Add(farm.Reset);
        farmArray.Add(farm.IdType);
        farmArray.Add(farm.Id);
        farmArray.Add(farm.Name);
        farmArray.Add(string.Join(",", farm.Location));
        farmArray.Add(new JArray(farm.QuestIds));

        var dropsArray = new JArray();
        foreach (var drop in farm.Drops.EmptyIfNull())
        {
            dropsArray.Add(CreateDropArray(drop));
        }

        farmArray.Add(dropsArray);

        var useMinimumLevel = farm.MinimumLevel > 0;
        var useStatisticId = farm.StatisticId > 0;
        var useRequiredQuestIds = farm.RequiredQuestIds.Count > 0;
        var useNote = !string.IsNullOrEmpty(farm.Note);
        var useFaction = !string.IsNullOrEmpty(farm.Faction);

        if (useFaction || useNote || useRequiredQuestIds || useStatisticId || useMinimumLevel)
        {
            farmArray.Add(farm.MinimumLevel ?? 0);
        }

        if (useFaction || useNote || useRequiredQuestIds || useStatisticId)
        {
            farmArray.Add(farm.StatisticId ?? 0);
        }

        if (useFaction || useNote || useRequiredQuestIds)
        {
            farmArray.Add(new JArray(farm.RequiredQuestIds));
        }

        if (useFaction || useNote)
        {
            farmArray.Add(farm.Note ?? "");
        }

        if (useFaction)
        {
            farmArray.Add(farm.Faction);
        }

        return farmArray;
    }

    private JArray CreateDropArray(ManualZoneMapDrop drop)
    {
        var dropArray = new JArray();

        var dropType = Enum.Parse<RewardType>(drop.Type, true);

        dropArray.Add(drop.Id);
        dropArray.Add(dropType);
        dropArray.Add(drop.SubType);
        dropArray.Add(drop.ClassMask);

        // Optional things
        var limit = drop.Limit.EmptyIfNull();
        var questIds = drop.QuestIds.EmptyIfNull();
        var requiredQuestId = drop.RequiredQuestId ?? 0;

        var useLimit = limit.Length > 0;
        var useQuestIds = questIds.Length > 0;
        var useRequiredQuestId = requiredQuestId > 0;
        var useNote = !string.IsNullOrEmpty(drop.Note);

        if (useNote || useRequiredQuestId || useQuestIds || useLimit)
        {
            dropArray.Add(JArray.FromObject(limit));
        }

        if (useNote || useRequiredQuestId || useQuestIds)
        {
            dropArray.Add(JArray.FromObject(questIds));
        }

        if (useNote || useRequiredQuestId)
        {
            dropArray.Add(requiredQuestId);
        }

        if (useNote)
        {
            dropArray.Add(drop.Note);
        }

        return dropArray;
    }

    public override object ReadJson(JsonReader reader, Type objectType, object existingValue,
        JsonSerializer serializer)
    {
        throw new NotImplementedException();
    }

    public override bool CanConvert(Type objectType)
    {
        return typeof(ManualZoneMapCategory) == objectType;
    }

    public override bool CanRead => false;
}