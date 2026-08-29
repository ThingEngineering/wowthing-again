namespace Wowthing.Tool.Models.Curves;

public class StaticCurvePoint
{
    public double Threshold { get; set; }
    public double Value { get; set; }

    public StaticCurvePoint(DumpCurvePoint dumpCurvePoint)
    {
        Threshold = dumpCurvePoint.Pos0;
        Value = dumpCurvePoint.Pos1;
    }
}
