using Wowthing.Lib.Enums;

namespace Wowthing.Web.Forms;

public class ApiMissingTransmogForm
{
    public bool AllRealms { get; set; }
    public bool IncludeRussia { get; set; }
    public WowRegion Region { get; set; }
}
