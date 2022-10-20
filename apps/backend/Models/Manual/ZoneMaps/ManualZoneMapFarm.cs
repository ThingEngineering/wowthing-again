using Wowthing.Backend.Converters.Manual;
using Wowthing.Backend.Models.Data.ZoneMaps;
using Wowthing.Lib.Enums;

namespace Wowthing.Backend.Models.Manual.ZoneMaps;

[JsonConverter(typeof(ManualZoneMapCategoryConverter))]
public class ManualZoneMapFarm
{
    [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
    public int? GroupId { get; set; }

    [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
    public int? MinimumLevel { get; set; }

    [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
    public int? StatisticId { get; set; }

    public FarmIdType IdType { get; set; }
    public int Id { get; set; }

    public string[] Location { get; set; }

    [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
    public string Faction { get; set; }

    public string Name { get; set; }

    [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
    public string Note { get; set; }

    public FarmResetType Reset { get; set; }
    public FarmType Type { get; set; }
    public List<int> QuestIds { get; set; }

    public List<int> RequiredQuestIds { get; set; }

    [JsonProperty(PropertyName = "dropsRaw")]
    public List<ManualZoneMapDrop> Drops { get; set; }

    public ManualZoneMapFarm(DataZoneMapFarm farm)
    {
        Drops = farm.Drops
            .EmptyIfNull()
            .Select(drop => new ManualZoneMapDrop(drop))
            .ToList();
        Location = (farm.Location ?? "").Split();
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

        if (farm.StatisticId > 0)
        {
            StatisticId = farm.StatisticId;
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
