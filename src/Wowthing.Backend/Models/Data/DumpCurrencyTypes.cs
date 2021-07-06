using CsvHelper.Configuration.Attributes;

namespace Wowthing.Backend.Models.Data
{
    public class DumpCurrencyTypes
    {
        public int Id { get; set; }

        public int CategoryId { get; set; }
        public int MaxEarnablePerWeek { get; set; }
        public int MaxQty { get; set; }

        [Name("Flags[0]")]
        public int Flags0 { get; set; }

        [Name("Flags[1]")]
        public int Flags1 { get; set; }

        [Name("Name_lang")]
        public string Name { get; set; }

        [Name("Description_lang")]
        public string Description { get; set; }
    }
}
