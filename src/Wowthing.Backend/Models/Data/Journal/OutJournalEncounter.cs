using System.Collections.Generic;
using Newtonsoft.Json;

namespace Wowthing.Backend.Models.Data.Journal
{
    public class OutJournalEncounter
    {
        public string Name { get; set; }
        public List<OutJournalEncounterItem> Items = new();
    }
}
