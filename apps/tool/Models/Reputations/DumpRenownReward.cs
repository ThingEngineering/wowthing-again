using CsvHelper.Configuration.Attributes;

namespace Wowthing.Tool.Models.Reputations;

// ReSharper disable InconsistentNaming
public class DumpRenownReward
{
    public short ID { get; set; }
    public short CovenantID { get; set; }
    public short Level { get; set; }
    public short UiOrder { get; set; }
    public int Flags { get; set; }
    public int Icon { get; set; }
    public int SpellID { get; set; }

    [Name("Description_lang")]
    public string Description { get; set; } = string.Empty;

    [Name("Name_lang")]
    public string Name { get; set; } = string.Empty;

    [Name("ToastDescription_lang")]
    public string ToastDescription { get; set; } = string.Empty;
}
