using Wowthing.Backend.Converters.Static;

namespace Wowthing.Backend.Models.Static;

[System.Text.Json.Serialization.JsonConverter(typeof(StaticReputationCategoryConverter))]
public class StaticReputationCategory
{
    public string Name { get; set; }
    public List<List<StaticReputationCategorySet>> Reputations { get; set; }

    [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
    public int? MinimumLevel { get; set; }

    public string Slug => Name.Slugify();
}

public class StaticReputationCategorySet
{
    [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
    public StaticReputationCategoryReputation Both { get; set; }

    [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
    public StaticReputationCategoryReputation Alliance { get; set; }

    [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
    public StaticReputationCategoryReputation Horde { get; set; }

    public bool Paragon { get; set; } = false;
}

public class StaticReputationCategoryReputation
{
    public int Id { get; set; }
    public string Icon { get; set; }

    [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
    public string Note { get; set; }

    [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
    public List<StaticReputationCategoryReputationReward> Rewards { get; set; }
}

public class StaticReputationCategoryReputationReward
{
    public int Id { get; set; }
    public string Type { get; set; }
}
