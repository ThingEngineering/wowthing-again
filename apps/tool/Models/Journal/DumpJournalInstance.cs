using CsvHelper.Configuration.Attributes;

// ReSharper disable InconsistentNaming
namespace Wowthing.Tool.Models.Journal;

public class DumpJournalInstance
{
    public int  ID { get; set; }

    public int AreaID { get; set; }
    public int Flags { get; set; }
    public int MapID { get; set; }

    [Name("Name_lang")]
    public string Name { get; set; } = string.Empty;
}
