namespace Wowthing.Tool.Models.Journal;

public class OutJournalTier
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Slug { get; set; }
    public List<OutJournalInstance> Instances { get; set; } = new();
}
