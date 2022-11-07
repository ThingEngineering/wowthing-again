using Wowthing.Backend.Models.Data.Journal;

namespace Wowthing.Backend.Data;

public static partial class Hardcoded
{
    public static readonly List<(DumpJournalTier, List<DumpJournalInstance>)> ExtraTiers = new()
    {
        (
            new DumpJournalTier
            {
                ID = 1,
                Name = "Miscellaneous",
            },
            new()
            {
                new DumpJournalInstance
                {
                    ID = 1,
                    MapID = 2236,
                    OrderIndex = 1,
                    Name = "Darkmaul Citadel",
                },
                new DumpJournalInstance
                {
                    ID = 2,
                    OrderIndex = 2,
                    Name = "Anniversary World Bosses",
                },
            }
        )
    };
}
