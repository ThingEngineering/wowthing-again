namespace Wowthing.Backend.Models.Data.Journal;

public class OutJournalEncounterItemAppearance
{
    public int AppearanceId { get; set; }
    public int ModifierId { get; set; }
    public List<int> Difficulties { get; set; } = new();
}