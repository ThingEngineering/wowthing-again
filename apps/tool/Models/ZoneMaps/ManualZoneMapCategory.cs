using Wowthing.Tool.Converters.Manual;

namespace Wowthing.Tool.Models.ZoneMaps;

[JsonConverter(typeof(ManualZoneMapCategoryConverter))]
public class ManualZoneMapCategory
{
    public int MinimumLevel { get; set; }
    public string MapName { get; set; }
    public string Name { get; set; }
    public string? WowheadGuide { get; set; }

    public List<int> RequiredQuestIds { get; set; }

    public List<ManualZoneMapFarm> Farms { get; set; }

    public string Slug => Name.Slugify();

    public ManualZoneMapCategory(DataZoneMapCategory cat)
    {
        MinimumLevel = cat.MinimumLevel;
        MapName = cat.MapName;
        Name = cat.Name;
        WowheadGuide = cat.WowheadGuide;

        RequiredQuestIds = (string.IsNullOrWhiteSpace(cat.RequiredQuestId) ? "" : cat.RequiredQuestId)
            .Split(' ', StringSplitOptions.RemoveEmptyEntries)
            .Select(q => int.Parse(q))
            .ToList();

        Farms = cat.Farms
            .EmptyIfNull()
            .Select(farm => new ManualZoneMapFarm(farm))
            .ToList();
    }
}
