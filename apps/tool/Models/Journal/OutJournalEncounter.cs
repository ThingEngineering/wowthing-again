using Wowthing.Tool.Converters.Journal;

namespace Wowthing.Tool.Models.Journal;

[JsonConverter(typeof(OutJournalEncounterConverter))]
public class OutJournalEncounter
{
    public int Id { get; set; }
    public int Flags { get; set; }
    public string Name { get; set; } = string.Empty;

    public List<OutJournalEncounterItemGroup> Groups = new();
    public Dictionary<int, int[]> Statistics { get; set; } = new();
}
