using CsvHelper.Configuration.Attributes;

namespace Wowthing.Tool.Models.Spells;

// ReSharper disable InconsistentNaming
public class DumpSpellName
{
    public int ID { get; set; }

    [Name("Name_lang")]
    public string Name { get; set; } = string.Empty;
}
