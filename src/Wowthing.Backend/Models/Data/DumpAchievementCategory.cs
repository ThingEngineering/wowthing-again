using CsvHelper.Configuration.Attributes;

namespace Wowthing.Backend.Models.Data
{
    public class DumpAchievementCategory
    {
        public int ID { get; set; }
        public int Parent { get; set; }
        
        [Name("Ui_order")]
        public int UiOrder { get; set; }
        
        [Name("Name_lang")]
        public string Name { get; set; }
    }
}