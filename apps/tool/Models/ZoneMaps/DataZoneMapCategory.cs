namespace Wowthing.Tool.Models.ZoneMaps;

public class DataZoneMapCategory : IDataCategory, ICloneable
{
    public int MinimumLevel { get; set; }
    public string MapName { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? RequiredQuestId { get; set; }
    public string? WowheadGuide { get; set; }
    public List<DataZoneMapFarm>? Farms { get; set; }

    public object Clone()
    {
        return new DataZoneMapCategory
        {
            MapName = MapName,
            MinimumLevel = MinimumLevel,
            Name = (string)Name.Clone(),
            WowheadGuide = WowheadGuide,
            Farms = Farms,
        };
    }
}
