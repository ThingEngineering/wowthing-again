using CsvHelper.Configuration.Attributes;

namespace Wowthing.Tool.Models.Customizations;

// ReSharper disable InconsistentNaming
public class DumpChrCustomizationChoice
{
    public int ChrCustomizationOptionID { get; set; }
    public int ChrCustomizationReqID { get; set; }
    public int ID { get; set; }

    [Name("Name_lang")]
    public string Name { get; set; } = string.Empty;
}
