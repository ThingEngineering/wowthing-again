using Wowthing.Lib.Enums;

namespace Wowthing.Web.Forms;

public class ApiMissingAuctionsForm
{
    public bool AllRealms { get; set; }
    public bool IncludeBids { get; set; }
    public bool IncludeRussia { get; set; }
    public bool MissingPetsMaxLevel { get; set; }
    public bool MissingPetsNeedMaxLevel { get; set; }
    public WowRegion Region { get; set; }
    public string Type { get; set; }
}
