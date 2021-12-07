using System.Collections.Generic;
using Newtonsoft.Json;

namespace Wowthing.Backend.Models.Data.Journal
{
    public class OutJournalEncounter
    {
        public string Name { get; set; }
        
        [JsonProperty(PropertyName = "itemsRaw")]
        public List<OutJournalEncounterItem> Items = new();
    }
}
