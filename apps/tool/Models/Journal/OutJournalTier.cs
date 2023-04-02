namespace Wowthing.Tool.Models.Journal;

public class OutJournalTier
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public List<OutJournalInstance> Instances { get; set; } = new();
}
