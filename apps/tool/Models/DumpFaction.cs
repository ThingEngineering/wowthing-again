using CsvHelper.Configuration.Attributes;

// ReSharper disable InconsistentNaming
namespace Wowthing.Tool.Models;

public class DumpFaction
{
    public short ID { get; set; }
    public short Expansion { get; set; }
    public short FriendshipRepID { get; set; }
    public short ParagonFactionID { get; set; }
    public short ParentFactionID { get; set; }

    [Name("Description_lang")]
    public string Description { get; set; }

    [Name("Name_lang")]
    public string Name { get; set; }
}
