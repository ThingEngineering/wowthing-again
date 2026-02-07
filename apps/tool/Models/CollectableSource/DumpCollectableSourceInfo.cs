namespace Wowthing.Tool.Models.CollectableSource;

// ReSharper disable InconsistentNaming
public class DumpCollectableSourceInfo
{
    public int ID { get; set; }

    public string Description { get; set; }
    public int HouseDecorID { get; set; }
    public int ItemModifiedAppearanceID { get; set; }
    public byte SourceTypeEnum { get; set; }
}
