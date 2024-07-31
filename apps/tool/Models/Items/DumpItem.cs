

// ReSharper disable InconsistentNaming
namespace Wowthing.Tool.Models.Items;

public class DumpItem
{
    public int ID { get; set; }

    public short ClassID { get; set; }
    public short CraftingQualityID { get; set; }
    public int IconFileDataID { get; set; }
    public WowInventoryType InventoryType { get; set; }
    public short SubclassID { get; set; }
}
