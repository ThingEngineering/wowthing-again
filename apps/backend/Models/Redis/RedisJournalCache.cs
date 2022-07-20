using Wowthing.Backend.Models.Data.Journal;

namespace Wowthing.Backend.Models.Redis;

public class RedisJournalCache
{
    public List<OutJournalTier> Tiers { get; set; } = new();
}