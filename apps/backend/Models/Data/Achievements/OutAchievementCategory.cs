namespace Wowthing.Backend.Models.Data.Achievements
{
    public class OutAchievementCategory
    {
        public int Id { get; }
        public string Name { get; }
        public List<int> AchievementIds { get; set; } = new();
        public List<OutAchievementCategory> Children { get; } = new();

        [JsonIgnore]
        public int Order { get; }
        
        [JsonIgnore]
        public int Parent { get; }

        public string Slug => Name.Slugify();

        public OutAchievementCategory(DumpAchievementCategory category)
        {
            Id = category.ID;
            Name = category.Name;
            Order = category.UiOrder;
            Parent = category.Parent;
        }
    }
}
