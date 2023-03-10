namespace Wowthing.Tool.Models.Journal;

public class OutJournalInstance
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Slug { get; set; }

    // [JsonProperty(PropertyName = "encountersRaw")]
    public List<OutJournalEncounter> Encounters { get; set; } = new();

    // [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
    public Dictionary<int, int> BonusIds { get; set; }
}

