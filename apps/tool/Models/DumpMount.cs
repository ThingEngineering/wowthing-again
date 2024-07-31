using CsvHelper.Configuration.Attributes;

// ReSharper disable InconsistentNaming
namespace Wowthing.Tool.Models;

public class DumpMount
{
    public int ID { get; set; }

    public int Flags { get; set; }
    public int SourceSpellID { get; set; }
    public short SourceTypeEnum { get; set; }

    [Name("Name_lang")]
    public string Name { get; set; } = string.Empty;
}
