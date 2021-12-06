using System.Collections.Generic;

namespace Wowthing.Backend.Models.Data.Journal
{
    public class OutJournalEncounterItem
    {
        public int Id { get; set; }
        public List<OutJournalEncounterItemAppearance> Appearances { get; set; }
    }
}
