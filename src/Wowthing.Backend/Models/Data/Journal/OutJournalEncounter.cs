using Wowthing.Backend.Converters;

namespace Wowthing.Backend.Models.Data.Journal
{
    [JsonConverter(typeof(OutJournalEncounterConverter))]
    public class OutJournalEncounter
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public List<OutJournalEncounterItemGroup> Groups = new();
    }
}
