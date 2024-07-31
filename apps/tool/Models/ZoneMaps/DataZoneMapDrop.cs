namespace Wowthing.Tool.Models.ZoneMaps;

public class DataZoneMapDrop
{
    public int Amount { get; set; }
    public int Id { get; set; }
    public int CriteriaId { get; set; }
    public int RequiredQuestId { get; set; }
    public string? Limit { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Note { get; set; }
    public string? QuestId { get; set; }
    public string Type { get; set; } = string.Empty;
}
