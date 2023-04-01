using CsvHelper.Configuration.Attributes;

namespace Wowthing.Tool.Models.Holidays;

// ReSharper disable InconsistentNaming
public class DumpHolidayNames
{
    public short ID { get; set; }

    [Name("Name_lang")]
    public string Name { get; set; } = string.Empty;
}
