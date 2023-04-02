// ReSharper disable InconsistentNaming

using CsvHelper.Configuration.Attributes;

namespace Wowthing.Tool.Models;

public class DumpCurrencyCategory
{
    public short ID { get; set; }

    public short ExpansionID { get; set; }
    public short Flags { get; set; }

    [Name("Name_lang")]
    public string Name { get; set; } = string.Empty;
}
