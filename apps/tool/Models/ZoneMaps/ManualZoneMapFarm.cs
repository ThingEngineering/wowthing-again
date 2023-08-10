using Wowthing.Tool.Enums;

namespace Wowthing.Tool.Models.ZoneMaps;

public class ManualZoneMapFarm
{
    public int Id { get; set; }
    public int? CriteriaId { get; set; }
    public int? GroupId { get; set; }
    public int? MinimumLevel { get; set; }
    public int? StatisticId { get; set; }
    public string Faction { get; set; }
    public string Name { get; set; }
    public string Note { get; set; }
    public string[] Location { get; set; }
    public FarmAnchorPoint AnchorPoint { get; set; }
    public FarmIdType IdType { get; set; }
    public FarmResetType Reset { get; set; }
    public FarmType Type { get; set; }
    public List<int> QuestIds { get; set; }
    public List<int> RequiredQuestIds { get; set; }
    public List<ManualZoneMapDrop> Drops { get; set; }

    public ManualZoneMapFarm(DataZoneMapFarm farm)
    {
        Drops = farm.Drops
            .EmptyIfNull()
            .Select(drop => new ManualZoneMapDrop(drop))
            .ToList();
        Location = (farm.Location ?? "").Split(' ', StringSplitOptions.RemoveEmptyEntries);
        Name = farm.Name;

        QuestIds = farm.QuestId
            .EmptyIfNullOrWhitespace()
            .Split(' ', StringSplitOptions.RemoveEmptyEntries)
            .Select(q => int.Parse(q))
            .ToList();

        RequiredQuestIds = farm.RequiredQuestId
            .EmptyIfNullOrWhitespace()
            .Split(' ', StringSplitOptions.RemoveEmptyEntries)
            .Select(q => int.Parse(q))
            .ToList();

        if (farm.MinimumLevel > 0)
        {
            MinimumLevel = farm.MinimumLevel;
        }

        if (farm.Type == "quest")
        {
            IdType = FarmIdType.Quest;
            Id = QuestIds.FirstOrDefault();
        }
        else if (farm.Type == "group")
        {
            IdType = FarmIdType.Group;
            Id = farm.GroupId;
        }
        else if (farm.InstanceId > 0)
        {
            IdType = FarmIdType.Instance;
            Id = farm.InstanceId;
        }
        else if (farm.ObjectId > 0)
        {
            IdType = FarmIdType.Object;
            Id = farm.ObjectId;
        }
        else
        {
            IdType = FarmIdType.Npc;
            Id = farm.NpcId;
        }

        if (farm.Type != "group" && farm.GroupId > 0)
        {
            GroupId = farm.GroupId;
        }

        if (farm.CriteriaId > 0)
        {
            CriteriaId = farm.CriteriaId;
        }

        if (farm.StatisticId > 0)
        {
            StatisticId = farm.StatisticId;
        }

        if (!string.IsNullOrEmpty(farm.AnchorPoint))
        {
            AnchorPoint = Enum.Parse<FarmAnchorPoint>(farm.AnchorPoint.Replace("-", ""), true);
        }

        if (!string.IsNullOrEmpty(farm.Faction))
        {
            Faction = farm.Faction;
        }

        if (!string.IsNullOrEmpty(farm.Note))
        {
            Note = farm.Note;
        }

        Reset = Enum.Parse<FarmResetType>(farm.Reset ?? "daily", true);
        Type = Enum.Parse<FarmType>(farm.Type ?? "kill", true);
    }
}
