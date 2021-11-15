using CsvHelper.Configuration.Attributes;

namespace Wowthing.Backend.Models.Data
{
    public class DumpItemSparse
    {
        public int ID { get; set; }
        
        [Name("Display_lang")]
        public string Name { get; set; }
    }
}
