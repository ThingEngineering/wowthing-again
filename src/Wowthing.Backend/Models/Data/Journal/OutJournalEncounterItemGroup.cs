using System.Collections.Generic;
using Newtonsoft.Json;

namespace Wowthing.Backend.Models.Data.Journal
{
    public class OutJournalEncounterItemGroup
    {
        public string Name { get; set; }        
        
        [JsonProperty(PropertyName = "itemsRaw")]
        public List<OutJournalEncounterItem> Items = new();

        [JsonIgnore]
        public int Order { get; set; }
    }
}
