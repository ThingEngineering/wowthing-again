using CsvHelper.Configuration.Attributes;

namespace Wowthing.Tool.Models;

// ReSharper disable InconsistentNaming
public class DumpChrSpecialization
{
    public short ClassID { get; set; }
    public short ID { get; set; }
    public short PrimaryStatPriority { get; set; }
    public short OrderIndex { get; set; }
    public WowRole Role { get; set; }

    [Name("FemaleName_lang")]
    public string FemaleName { get; set; } = string.Empty;

    [Name("Name_lang")]
    public string Name { get; set; } = string.Empty;
}
