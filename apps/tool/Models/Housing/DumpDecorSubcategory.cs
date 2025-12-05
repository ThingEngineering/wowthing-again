using CsvHelper.Configuration.Attributes;

namespace Wowthing.Tool.Models.Housing;

// ReSharper disable InconsistentNaming
public class DumpDecorSubcategory
{
    public short ID { get; set; }

    public short DecorCategoryID { get; set; }
    public short OrderIndex { get; set; }

    [Name("Name_lang")]
    public string Name { get; set; } = string.Empty;
}
