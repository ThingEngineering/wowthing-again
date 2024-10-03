using CsvHelper.Configuration.Attributes;

namespace Wowthing.Tool.Models.Transmog;

// ReSharper disable InconsistentNaming
public class DumpSpellItemEnchantment
{
    public int ID { get; set; }
    public short ItemLevel { get; set; }
    public short ItemLevelMax { get; set; }
    public short ItemLevelMin { get; set; }
    public short MaxLevel { get; set; }
    public short MinLevel { get; set; }
    public short ScalingClass { get; set; }

    [Name("EffectScalingPoints[0]")]
    public double EffectScalingPoints0 { get; set; }

    [Name("EffectScalingPoints[1]")]
    public double EffectScalingPoints1 { get; set; }

    [Name("EffectScalingPoints[2]")]
    public double EffectScalingPoints2 { get; set; }

    [Name("Name_lang")]
    public string Name { get; set; } = string.Empty;


    public List<double> EffectScalingPoints => new()
    {
        EffectScalingPoints0,
        EffectScalingPoints1,
        EffectScalingPoints2,
    };
}
