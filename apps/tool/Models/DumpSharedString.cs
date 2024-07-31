using CsvHelper.Configuration.Attributes;

namespace Wowthing.Tool.Models;

// ReSharper disable InconsistentNaming
public class DumpSharedString
{
    public int ID { get; set; }

    public int Flags { get; set; }

    [Name("String_lang")]
    public string String { get; set; } = string.Empty;
}
