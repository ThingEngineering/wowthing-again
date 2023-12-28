using CsvHelper.Configuration.Attributes;

namespace Wowthing.Tool.Models.Items;

// ReSharper disable InconsistentNaming
public class DumpItemSparseName
{
    public int ID { get; set; }

    [Name("Display_lang")]
    public string Name { get; set; } = string.Empty;
}
