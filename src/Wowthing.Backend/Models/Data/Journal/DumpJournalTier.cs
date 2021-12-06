using CsvHelper.Configuration.Attributes;

// ReSharper disable InconsistentNaming
namespace Wowthing.Backend.Models.Data.Journal
{
    public class DumpJournalTier
    {
        public int ID { get; set; }

        [Name("Name_lang")]
        public string Name { get; set; }
    }
}
