using Wowthing.Backend.Converters;
using Wowthing.Lib.Enums;

namespace Wowthing.Backend.Models.Data.Achievements
{
    [JsonConverter(typeof(OutAchievementConverter))]
    public class OutAchievement
    {
        public int CategoryId { get; }
        public int CriteriaTreeId { get; }
        public int Faction { get; }
        public int Id { get; }
        public int MinimumCriteria { get; }
        public int Order { get; }
        public int Points { get; }
        public int SupersededBy { get; set; }
        public int Supersedes { get; }
        public string Description { get; }
        public string Name { get; }
        public string Reward { get; }
        public WowAchievementFlags Flags { get; }

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
    }
}
