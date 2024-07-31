using CsvHelper.Configuration.Attributes;

namespace Wowthing.Tool.Models.Customizations;

// ReSharper disable InconsistentNaming
public class DumpChrCustomizationCategory
{
    public int ID { get; set; }
    public int OrderIndex { get; set; }

    [Name("CategoryName_lang")]
    public string CategoryName { get; set; } = string.Empty;
}
