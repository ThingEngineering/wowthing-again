using Wowthing.Tool.Converters.Achievements;

namespace Wowthing.Tool.Models.Achievements;

[JsonConverter(typeof(OutAchievementConverter))]
public class OutAchievement : ICloneable
{
    public int CategoryId { get; set; }
    public int CriteriaTreeId { get; set; }
    public int Faction { get; set; }
    public int Id { get; set; }
    public int MinimumCriteria { get; set; }
    public int Order { get; set; }
    public int Points { get; set; }
    public int SupersededBy { get; set; }
    public int Supersedes { get; set; }
    public string Description { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Reward { get; set; } = string.Empty;
    public WowAchievementFlags Flags { get; set; }

    public OutAchievement()
    { }

    public OutAchievement(DumpAchievement dump)
    {
        CategoryId = dump.Category;
        CriteriaTreeId = dump.CriteriaTree;
        Faction = dump.Faction;
        Flags = dump.Flags;
        Id = dump.ID;
        MinimumCriteria = dump.MinimumCriteria;
        Order = dump.UiOrder;
        Points = dump.Points;
        Supersedes = dump.Supercedes;
        Description = dump.Description;
        Name = dump.Name;
        Reward = dump.Reward;
    }

    public object Clone()
    {
        return new OutAchievement
        {
            CategoryId = CategoryId,
            CriteriaTreeId = CriteriaTreeId,
            Faction = Faction,
            Flags = Flags,
            Id = Id,
            MinimumCriteria = MinimumCriteria,
            Order = Order,
            Points = Points,
            Supersedes = Supersedes,
            Description = Description,
            Name = Name,
            Reward = Reward,
        };
    }
}
