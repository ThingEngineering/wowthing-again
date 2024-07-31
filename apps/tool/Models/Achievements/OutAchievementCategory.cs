namespace Wowthing.Tool.Models.Achievements;

public class OutAchievementCategory : ICloneable
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public List<int> AchievementIds { get; set; } = new();
    public List<OutAchievementCategory> Children { get; set; } = new();

    [JsonIgnore]
    public int Order { get; set; }

    [JsonIgnore]
    public int Parent { get; set; }

    public string Slug { get; set; } = string.Empty;

    public OutAchievementCategory()
    { }

    public OutAchievementCategory(DumpAchievementCategory category)
    {
        Id = category.ID;
        Name = category.Name;
        Slug = Name.Slugify();
        Order = category.UiOrder;
        Parent = category.Parent;
    }

    public object Clone()
    {
        return new OutAchievementCategory
        {
            Id = Id,
            Name = (string)Name.Clone(),
            Slug = (string)Slug.Clone(),
            Order = Order,
            Parent = Parent,
            AchievementIds = AchievementIds,
            Children = Children,
        };
    }
}
