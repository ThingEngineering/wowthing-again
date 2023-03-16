using CsvHelper.Configuration.Attributes;

namespace Wowthing.Tool.Models;

// ReSharper disable InconsistentNaming
public class DumpKeystoneAffix
{
    public int ID { get; set; }

    [Name("Name_lang")]
    public string Name { get; set; }

    [Name("Description_lang")]
    public string Description { get; set; }
}
