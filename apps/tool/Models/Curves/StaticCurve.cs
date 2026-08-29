using Wowthing.Tool.Converters.Curves;

namespace Wowthing.Tool.Models.Curves;

[JsonConverter(typeof(StaticCurveConverter))]
public class StaticCurve
{
    public int Id { get; set; }
    public int Type { get; set; }
    public StaticCurvePoint[] Points { get; set; }

    public StaticCurve(DumpCurve dumpCurve, DumpCurvePoint[] dumpCurvePoints)
    {
        Id = dumpCurve.ID;
        Type = dumpCurve.Type;

        Points = dumpCurvePoints.Select(dumpCurvePoint => new StaticCurvePoint(dumpCurvePoint)).ToArray();
    }
}
