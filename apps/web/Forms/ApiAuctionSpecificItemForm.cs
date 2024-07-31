using Wowthing.Lib.Enums;

namespace Wowthing.Web.Forms;

public class ApiAuctionSpecificItemForm
{
    public bool AllRealms { get; set; }
    public bool IncludeRussia { get; set; }
    public int ItemId { get; set; }
    public WowRegion Region { get; set; }
}
