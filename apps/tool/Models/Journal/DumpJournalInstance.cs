using CsvHelper.Configuration.Attributes;

// ReSharper disable InconsistentNaming
namespace Wowthing.Tool.Models.Journal;

public class DumpJournalInstance
{
    public short  ID { get; set; }

    public int AreaID { get; set; }
    public int Flags { get; set; }
    public short MapID { get; set; }

    [Name("Name_lang")]
    public string Name { get; set; } = string.Empty;
}
