using CsvHelper.Configuration.Attributes;

namespace Wowthing.Tool.Models.Housing;

// ReSharper disable InconsistentNaming
public class DumpHouseDecor
{
    public int ID { get; set; }

    public int Flags { get; set; }
    public int ItemID { get; set; }
    public int ThumbnailFileDataID { get; set; }
    public short ModelType { get; set; }
    public short OrderIndex { get; set; }
    public short Type { get; set; }

    [Name("Name_lang")]
    public string Name { get; set; } = string.Empty;
}
