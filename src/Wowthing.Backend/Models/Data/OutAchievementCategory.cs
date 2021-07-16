using System.Collections.Generic;
using Newtonsoft.Json;
using Wowthing.Lib.Extensions;

namespace Wowthing.Backend.Models.Data
{
    public class OutAchievementCategory
    {
        public int Id { get; }
        public string Name { get; }
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
