using CsvHelper.Configuration.Attributes;

namespace Wowthing.Tool.Models.Housing;

// ReSharper disable InconsistentNaming
public class DumpDecorXDecorSubcategory
{
    public short ID { get; set; }

    public short DecorSubcategoryID { get; set; }
    public int HouseDecorID { get; set; }
}
