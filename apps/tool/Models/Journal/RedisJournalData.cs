namespace Wowthing.Tool.Models.Journal;

public class RedisJournalData
{
    public HashSet<string> TokenEncounters { get; set; } = new();
    public Dictionary<int, int[]> ItemExpansion { get; set; }
    public List<OutJournalTier> Tiers { get; set; } = new();
}
