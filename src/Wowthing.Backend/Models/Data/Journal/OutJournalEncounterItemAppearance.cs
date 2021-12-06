using System.Collections.Generic;

namespace Wowthing.Backend.Models.Data.Journal
{
    public class OutJournalEncounterItemAppearance
    {
        public int AppearanceId { get; set; }
        public List<int> Difficulties { get; set; }
    }
}
