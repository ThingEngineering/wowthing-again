using CsvHelper.Configuration.Attributes;

namespace Wowthing.Tool.Models.Transmog;

// ReSharper disable InconsistentNaming
public class DumpTransmogSet
{
    public int ID { get; set; }
    public int ClassMask { get; set; }
    public int ItemNameDescriptionID { get; set; }
    public short Flags { get; set; }
    public short TransmogSetGroupID { get; set; }

    [Name("Name_lang")]
    public string Name { get; set; } = string.Empty;
}
