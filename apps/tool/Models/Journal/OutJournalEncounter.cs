namespace Wowthing.Tool.Models.Journal;

[JsonConverter(typeof(OutJournalEncounterConverter))]
public class OutJournalEncounter
{
    public int Id { get; set; }
    public string Name { get; set; }

    public List<OutJournalEncounterItemGroup> Groups = new();
    public Dictionary<int, int[]> Statistics { get; set; }
}
