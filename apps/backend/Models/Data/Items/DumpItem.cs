using Wowthing.Lib.Enums;

// ReSharper disable InconsistentNaming
namespace Wowthing.Backend.Models.Data.Items;

public class DumpItem
{
    public int ID { get; set; }
        
    public short ClassID { get; set; }
    public WowInventoryType InventoryType { get; set; }
    public short SubclassID { get; set; }
}