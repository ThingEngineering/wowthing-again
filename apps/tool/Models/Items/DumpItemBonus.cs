using CsvHelper.Configuration.Attributes;

// ReSharper disable InconsistentNaming
namespace Wowthing.Tool.Models.Items;

public class DumpItemBonus
{
    public int ID { get; set; }

    public int OrderIndex { get; set; }
    public int ParentItemBonusListID { get; set; }
    public int Type { get; set; }

    [Name("Value[0]")]
    public int Value0 { get; set; }

    [Name("Value[1]")]
    public int Value1 { get; set; }

    [Name("Value[2]")]
    public int Value2 { get; set; }
}
