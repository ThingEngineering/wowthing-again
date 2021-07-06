using CsvHelper.Configuration.Attributes;

namespace Wowthing.Backend.Models.Data
{
    public class DumpCurrencyCategory
    {
        public int Id { get; set; }

        public int ExpansionId { get; set; }
        public int Flags { get; set; }
        
        [Name("Name_lang")]
        public string Name { get; set; }
    }
}
