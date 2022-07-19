using CsvHelper.Configuration.Attributes;

// ReSharper disable InconsistentNaming
namespace Wowthing.Backend.Models.Data;

public class DumpCreature
{
    public int ID { get; set; }

    [Name("Name_lang")]
    public string Name { get; set; }
}