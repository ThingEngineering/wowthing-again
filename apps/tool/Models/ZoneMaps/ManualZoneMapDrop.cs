namespace Wowthing.Tool.Models.ZoneMaps;

public class ManualZoneMapDrop
{
    public int Amount { get; set; }
    public int Id { get; set; }
    public int ClassMask { get; set; }
    public int SubType { get; set; }
    public int? RequiredQuestId { get; set; }
    public string? Note { get; set; }
    public string Type { get; set; }

    public int[]? QuestIds { get; set; }
    public string[]? Limit { get; set; }

    public ManualZoneMapDrop(DataZoneMapDrop drop)
    {
        Id = drop.Id;
        Type = drop.Type;
        Amount = drop.Amount;

        if (!string.IsNullOrEmpty(drop.Limit))
        {
            Limit = drop.Limit.Split();
        }

        if (!string.IsNullOrEmpty(drop.Note))
        {
            Note = drop.Note;
        }

        if (!string.IsNullOrWhiteSpace(drop.QuestId))
        {
            QuestIds = drop.QuestId
                .Split(' ', StringSplitOptions.RemoveEmptyEntries)
                .Select(int.Parse)
                .ToArray();
        }

        if (drop.CriteriaId > 0)
        {
            SubType = drop.CriteriaId;
        }

        if (drop.RequiredQuestId > 0)
        {
            RequiredQuestId = drop.RequiredQuestId;
        }
    }
}
