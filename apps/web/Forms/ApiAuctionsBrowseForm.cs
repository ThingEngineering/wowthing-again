using Wowthing.Lib.Enums;

namespace Wowthing.Web.Forms;

public class ApiAuctionsBrowseForm
{
    public short DefaultFilter { get; set; }
    public short InventoryType { get; set; }
    public short ItemClass { get; set; }
    public short ItemSubclass { get; set; }
    public WowRegion Region { get; set; }
}
