namespace Wowthing.Backend.Models.Data.Achievements;

public class OutAchievementCategory : ICloneable
{
    public int Id { get; set; }
    public string Name { get; set; }
    public List<int> AchievementIds { get; set; } = new();
    public List<OutAchievementCategory> Children { get; set; } = new();

    [JsonIgnore]
    public int Order { get; set; }

    [JsonIgnore]
    public int Parent { get; set; }

    public string Slug => Name.Slugify();

    public OutAchievementCategory()
    { }

    public OutAchievementCategory(DumpAchievementCategory category)
    {
        Id = category.ID;
        Name = category.Name;
        Order = category.UiOrder;
        Parent = category.Parent;
    }

    public object Clone()
    {
        return new OutAchievementCategory
        {
            Id = Id,
            Name = (string)Name.Clone(),
            Order = Order,
            Parent = Parent,
            AchievementIds = AchievementIds,
            Children = Children,
        };
    }
}
