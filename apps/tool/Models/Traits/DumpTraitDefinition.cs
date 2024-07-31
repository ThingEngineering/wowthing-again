using CsvHelper.Configuration.Attributes;

namespace Wowthing.Tool.Models.Traits;

// ReSharper disable InconsistentNaming
public class DumpTraitDefinition
{
    public int ID { get; set; }

    public int OverridesSpellID { get; set; }
    public int SpellID { get; set; }
    public int VisibleSpellID { get; set; }

    [Name("OverrideDescription_lang")]
    public string OverrideDescription { get; set; }

    [Name("OverrideName_lang")]
    public string OverrideName { get; set; }

    [Name("OverrideSubtext_lang")]
    public string OverrideSubtext { get; set; }
}
