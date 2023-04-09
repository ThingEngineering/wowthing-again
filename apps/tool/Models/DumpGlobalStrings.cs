using CsvHelper.Configuration.Attributes;

namespace Wowthing.Tool.Models;

// ReSharper disable InconsistentNaming
public class DumpGlobalStrings
{
    public int ID { get; set; }

    public string BaseTag { get; set; } = string.Empty;

    [Name("TagText_lang")]
    public string TagText { get; set; } = string.Empty;
}
