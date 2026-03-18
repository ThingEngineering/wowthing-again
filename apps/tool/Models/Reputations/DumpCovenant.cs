using CsvHelper.Configuration.Attributes;

namespace Wowthing.Tool.Models.Reputations;

// ReSharper disable InconsistentNaming
public class DumpCovenant
{
    public short ID { get; set; }
    public short CurrencyTypesID { get; set; }
    public short FactionID { get; set; }

    [Name("Name_lang")]
    public string Name { get; set; } = string.Empty;
}
