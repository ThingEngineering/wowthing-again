namespace Wowthing.Tool.Models.Journal;

public class OutJournalInstance
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;

    public List<OutJournalEncounter> EncountersRaw { get; set; } = new();

    public Dictionary<int, int> BonusIds { get; set; } = new();
}
