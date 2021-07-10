using CsvHelper.Configuration.Attributes;

namespace Wowthing.Backend.Models.Data
{
    public class DumpAchievement
    {
        public int Category { get; set; }
        public int CovenantID { get; set; }
        public int Faction { get; set; }
        public int Flags { get; set; }
        public int IconFileID { get; set; }
        public int ID { get; set; }
        public int Points { get; set; }
        public int Supercedes { get; set; }

        [Name("Criteria_tree")]
        public int CriteriaTree { get; set; }

        [Name("Minimum_criteria")]
        public int MinimumCritera { get; set; }

        [Name("Shares_criteria")]
        public int SharesCriteria { get; set; }
        
        [Name("Ui_order")]
        public int UiOrder { get; set; }
        
        [Name("Description_lang")]
        public string Description { get; set; }
        
        [Name("Name_lang")]
        public string Name { get; set; }
    }
}
