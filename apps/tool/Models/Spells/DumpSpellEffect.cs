using CsvHelper.Configuration.Attributes;

namespace Wowthing.Tool.Models.Spells;

// ReSharper disable InconsistentNaming
public class DumpSpellEffect
{
    public int Effect { get; set; }
    public int EffectIndex { get; set; }
    public int EffectItemType { get; set; }
    public int EffectTriggerSpell { get; set; }
    public int ID { get; set; }
    public int SpellID { get; set; }

    [Name("EffectMiscValue[0]")]
    public int EffectMiscValue0 { get; set; }

    [Name("EffectMiscValue[1]")]
    public int EffectMiscValue1 { get; set; }
}
