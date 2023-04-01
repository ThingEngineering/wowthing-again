using CsvHelper.Configuration.Attributes;

// ReSharper disable InconsistentNaming
namespace Wowthing.Tool.Models.Journal;

public class DumpJournalTier
{
    public int ID { get; set; }

    [Name("Name_lang")]
    public string Name { get; set; } = string.Empty;
}
