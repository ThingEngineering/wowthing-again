// ReSharper disable InconsistentNaming

using CsvHelper.Configuration.Attributes;

namespace Wowthing.Tool.Models;

public class DumpMap
{
    public int ID { get; set; }

    public int ExpansionID { get; set; }
    public int InstanceType { get; set; }
    public int MaxPlayers { get; set; }

    [Name("MapName_lang")]
    public string Name { get; set; } = string.Empty;
}
