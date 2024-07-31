using CsvHelper.Configuration.Attributes;

namespace Wowthing.Tool.Models.Spells;

// ReSharper disable InconsistentNaming
public class DumpSpell
{
    public int ID { get; set; }

    [Name("NameSubtext_lang")]
    public string NameSubtext { get; set; }
}
