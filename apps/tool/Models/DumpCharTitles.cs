using CsvHelper.Configuration.Attributes;

namespace Wowthing.Tool.Models;

// ReSharper disable InconsistentNaming
public class DumpCharTitles
{
    public short ID { get; set; }

    [Name("Name1_lang")]
    public string FemaleName { get; set; } = string.Empty;

    [Name("Name_lang")]
    public string MaleName { get; set; } = string.Empty;
}
