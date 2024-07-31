using Wowthing.Tool.Enums;
using Wowthing.Tool.Models.ZoneMaps;

namespace Wowthing.Tool.Converters.Manual;

public class ManualZoneMapCategoryConverter : JsonConverter<ManualZoneMapCategory>
{
    public override ManualZoneMapCategory Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        throw new NotImplementedException();
    }

    public override void Write(Utf8JsonWriter writer, ManualZoneMapCategory category, JsonSerializerOptions options)
    {
        writer.WriteStartArray();

        writer.WriteStringValue(category.Name);
        writer.WriteStringValue(category.Slug);
        writer.WriteStringValue(category.MapName);
        writer.WriteNumberValue(category.MinimumLevel);

        writer.WriteNumberArray(category.RequiredQuestIds);

        writer.WriteObjectArray(category.Farms, WriteFarmArray);

        if (!string.IsNullOrWhiteSpace(category.WowheadGuide))
        {
            writer.WriteStringValue(category.WowheadGuide);
        }

        writer.WriteEndArray();
    }

    private void WriteFarmArray(Utf8JsonWriter writer, ManualZoneMapFarm farm)
    {
        writer.WriteStartArray();

        writer.WriteNumberValue((int)farm.Type);
        writer.WriteNumberValue((int)farm.Reset);
        writer.WriteNumberValue((int)farm.IdType);
        writer.WriteNumberValue(farm.Id);
        writer.WriteStringValue(farm.Name);
        writer.WriteStringValue(string.Join(",", farm.Location));

        writer.WriteNumberArray(farm.QuestIds);

        writer.WriteObjectArray(farm.Drops.EmptyIfNull(), WriteDropArray);

        bool useMinimumLevel = farm.MinimumLevel > 0;
        bool useStatisticId = farm.StatisticId > 0;
        bool useRequiredQuestIds = farm.RequiredQuestIds.Count > 0;
        bool useCriteriaId = farm.CriteriaId > 0;
        bool useNote = !string.IsNullOrEmpty(farm.Note);
        bool useFaction = !string.IsNullOrEmpty(farm.Faction);
        bool useGroupId = farm.GroupId > 0;
        bool useAnchorPoint = farm.AnchorPoint != FarmAnchorPoint.None;

        if (useAnchorPoint || useGroupId || useFaction || useNote || useCriteriaId || useRequiredQuestIds || useStatisticId || useMinimumLevel)
        {
            writer.WriteNumberValue(farm.MinimumLevel ?? 0);
        }

        if (useAnchorPoint || useGroupId || useFaction || useNote || useCriteriaId || useRequiredQuestIds || useStatisticId)
        {
            writer.WriteNumberValue(farm.StatisticId ?? 0);
        }

        if (useAnchorPoint || useGroupId || useFaction || useNote || useCriteriaId || useRequiredQuestIds)
        {
            writer.WriteNumberArray(farm.RequiredQuestIds);
        }

        if (useAnchorPoint || useGroupId || useFaction || useNote || useCriteriaId)
        {
            writer.WriteNumberValue(farm.CriteriaId ?? 0);
        }

        if (useAnchorPoint || useGroupId || useFaction || useNote)
        {
            writer.WriteStringValue(farm.Note ?? "");
        }

        if (useAnchorPoint || useGroupId || useFaction)
        {
            writer.WriteStringValue(farm.Faction);
        }

        if (useAnchorPoint || useGroupId)
        {
            writer.WriteNumberValue(farm.GroupId ?? 0);
        }

        if (useAnchorPoint)
        {
            writer.WriteNumberValue((int)farm.AnchorPoint);
        }

        writer.WriteEndArray();
    }

    private void WriteDropArray(Utf8JsonWriter writer, ManualZoneMapDrop drop)
    {
        writer.WriteStartArray();

        var dropType = Enum.Parse<RewardType>(drop.Type, true);

        writer.WriteNumberValue(drop.Id);
        writer.WriteNumberValue((int)dropType);
        writer.WriteNumberValue(drop.SubType);
        writer.WriteNumberValue(drop.ClassMask);

        // Optional things
        var limit = drop.Limit.EmptyIfNull();
        var questIds = drop.QuestIds.EmptyIfNull();
        var requiredQuestId = drop.RequiredQuestId ?? 0;

        var useLimit = limit.Length > 0;
        var useQuestIds = questIds.Length > 0;
        var useRequiredQuestId = requiredQuestId > 0;
        var useAmount = drop.Amount > 0;
        var useNote = !string.IsNullOrEmpty(drop.Note);

        if (useNote || useAmount || useRequiredQuestId || useQuestIds || useLimit)
        {
            writer.WriteStringArray(limit);
        }

        if (useNote || useAmount || useRequiredQuestId || useQuestIds)
        {
            writer.WriteNumberArray(questIds);
        }

        if (useNote || useAmount || useRequiredQuestId)
        {
            writer.WriteNumberValue(requiredQuestId);
        }

        if (useNote || useAmount)
        {
            writer.WriteNumberValue(drop.Amount);
        }

        if (useNote)
        {
            writer.WriteStringValue(drop.Note);
        }

        writer.WriteEndArray();
    }
}
