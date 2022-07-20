using Wowthing.Lib.Enums;

namespace Wowthing.Lib.Models.Wow;

public class WowPeriod
{
    public WowRegion Region { get; set; }
    public int Id { get; set; }
    public DateTime Starts { get; set; }
    public DateTime Ends { get; set; }
}