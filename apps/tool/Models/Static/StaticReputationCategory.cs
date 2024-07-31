using Wowthing.Tool.Converters.Static;

namespace Wowthing.Tool.Models.Static;

[JsonConverter(typeof(StaticReputationCategoryConverter))]
public class StaticReputationCategory
{
    public string Name { get; set; }
    public List<List<StaticReputationCategorySet>> Reputations { get; set; }

    public int? MinimumLevel { get; set; }

    public string Slug => Name.Slugify();
}

public class StaticReputationCategorySet
{
    public StaticReputationCategoryReputation Both { get; set; }
    public StaticReputationCategoryReputation Alliance { get; set; }
    public StaticReputationCategoryReputation Horde { get; set; }

    public bool Paragon { get; set; } = false;
}

public class StaticReputationCategoryReputation
{
    public int Id { get; set; }
    public string Icon { get; set; }
    public string Note { get; set; }
    public List<StaticReputationCategoryReputationReward> Rewards { get; set; }
}

public class StaticReputationCategoryReputationReward
{
    public int Id { get; set; }
    public string Type { get; set; }
}
