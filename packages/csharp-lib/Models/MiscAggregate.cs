using Wowthing.Lib.Enums;

namespace Wowthing.Lib.Models;

public class MiscAggregate
{
    // 2 bytes
    public MiscReportType ReportType { get; set; }
    public short Region { get; set; }

    // variable
    public string JsonData { get; set; }
}
