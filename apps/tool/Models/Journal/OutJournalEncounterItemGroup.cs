namespace Wowthing.Tool.Models.Journal;

public class OutJournalEncounterItemGroup
{
    public string Name { get; set; } = string.Empty;

    public List<OutJournalEncounterItem> Items = new();

    [JsonIgnore]
    public int Order { get; set; }
}
