using CsvHelper.Configuration.Attributes;
using Wowthing.Tool.Enums;

namespace Wowthing.Tool.Models.Spells;

// ReSharper disable InconsistentNaming
public class DumpSpellMisc
{
    public int SpellID { get; set; }

    [Name("Attributes[7]")]
    public WowSpellFlags8 Flags8 { get; set; }
}
