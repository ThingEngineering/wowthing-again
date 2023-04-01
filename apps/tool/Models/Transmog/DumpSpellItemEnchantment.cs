using CsvHelper.Configuration.Attributes;

namespace Wowthing.Tool.Models.Transmog;

// ReSharper disable InconsistentNaming
public class DumpSpellItemEnchantment
{
    public int ID { get; set; }

    [Name("Name_lang")]
    public string Name { get; set; } = string.Empty;
}
