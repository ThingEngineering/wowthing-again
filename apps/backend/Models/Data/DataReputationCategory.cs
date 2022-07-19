using Wowthing.Backend.Converters;

namespace Wowthing.Backend.Models.Data;

[JsonConverter(typeof(DataReputationCategoryConverter))]
public class DataReputationCategory
{
    public string Name { get; set; }
    public List<List<DataReputationSet>> Reputations { get; set; }

    [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
    public int? MinimumLevel { get; set; }

    public string Slug => Name.Slugify();
}

public class DataReputationSet
{
    [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
    public DataReputation Both { get; set; }

    [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
    public DataReputation Alliance { get; set; }

    [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
    public DataReputation Horde { get; set; }

    public bool Paragon { get; set; } = false;
}

public class DataReputation
{
    public int Id { get; set; }
    public string Icon { get; set; }

    [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
    public string Note { get; set; }

    [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
    public List<DataReputationReward> Rewards { get; set; }
}

public class DataReputationReward
{
    public int Id { get; set; }
    public string Type { get; set; }
}