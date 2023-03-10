namespace Wowthing.Tool.Models.Progress;

public class OutProgress
{
    public string Name { get; set; }
    public List<int> RequiredQuestIds { get; set; }
    public List<OutProgressGroup> Groups { get; set; }

    // [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
    public int? MinimumLevel { get; set; }

    public string Slug => Name.Slugify();

    public OutProgress(DataProgress data)
    {
        Name = data.Name;

        RequiredQuestIds = data.RequiredQuestId
            .EmptyIfNullOrWhitespace()
            .Split(' ', StringSplitOptions.RemoveEmptyEntries)
            .Select(id => int.Parse(id))
            .ToList();

        Groups = data.Groups
            .EmptyIfNull()
            .Select(group => new OutProgressGroup(group))
            .ToList();

        if (data.MinimumLevel > 0)
        {
            MinimumLevel = data.MinimumLevel;
        }
    }
}
