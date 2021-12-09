using System.Collections.Generic;

namespace Wowthing.Backend.Models.Data.Journal
{
    public class OutJournalEncounter
    {
        public string Name { get; set; }

        public List<OutJournalEncounterItemGroup> Groups = new();
    }
}
