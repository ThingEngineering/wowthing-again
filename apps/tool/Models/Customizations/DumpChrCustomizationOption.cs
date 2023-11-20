using CsvHelper.Configuration.Attributes;

namespace Wowthing.Tool.Models.Customizations;

// ReSharper disable InconsistentNaming
public class DumpChrCustomizationOption
{
    public int ChrCustomizationCategoryID { get; set; }
    public int ID { get; set; }
    public int OrderIndex { get; set; }
    public int SecondaryOrderIndex { get; set; }

    [Name("Name_lang")]
    public string Name { get; set; } = string.Empty;
}
