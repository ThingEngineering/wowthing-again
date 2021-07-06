using CsvHelper.Configuration.Attributes;

namespace Wowthing.Backend.Models.Data
{
    public class DumpCurrencyCategory
    {
        public int ID { get; set; }

        public int ExpansionID { get; set; }
        public int Flags { get; set; }
        
        [Name("Name_lang")]
        public string Name { get; set; }
    }
}
