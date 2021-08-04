using CsvHelper.Configuration.Attributes;
using Wowthing.Lib.Enums;

// ReSharper disable InconsistentNaming
namespace Wowthing.Backend.Models.Data
{
    public class DumpAchievement
    {
        public int Category { get; set; }
        public int CovenantID { get; set; }
        public int Faction { get; set; }
        public WowAchievementFlags Flags { get; set; }
        public int IconFileID { get; set; }
        public int ID { get; set; }
        public int Points { get; set; }
        public int Supercedes { get; set; }

        [Name("Criteria_tree")]
        public int CriteriaTree { get; set; }

        [Name("Minimum_criteria")]
        public int MinimumCriteria { get; set; }

        [Name("Shares_criteria")]
        public int SharesCriteria { get; set; }
        
        [Name("Ui_order")]
        public int UiOrder { get; set; }
        
        [Name("Description_lang")]
        public string Description { get; set; }
        
        [Name("Title_lang")]
        public string Name { get; set; }
        
        [Name("Reward_lang")]
        public string Reward { get; set; }
    }
}
