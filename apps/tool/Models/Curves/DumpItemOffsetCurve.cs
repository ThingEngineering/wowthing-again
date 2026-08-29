using Wowthing.Tool.Converters.Curves;

namespace Wowthing.Tool.Models.Curves;

// ReSharper disable InconsistentNaming
[JsonConverter(typeof(DumpItemOffsetCurveConverter))]
public class DumpItemOffsetCurve
{
    public int ID { get; set; }

    public int CurveID { get; set; }
    public int Offset { get; set; }
}
