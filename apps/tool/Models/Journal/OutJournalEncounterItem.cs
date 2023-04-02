namespace Wowthing.Tool.Models.Journal;

public class OutJournalEncounterItem
{
    public int Id { get; set; }
    public int ClassMask { get; set; }
    public int ClassId { get; set; }
    public int SubclassId { get; set; }
    public RewardType Type { get; set; }
    public WowQuality Quality { get; set; }
    public List<OutJournalEncounterItemAppearance> Appearances { get; set; } = new();
}
